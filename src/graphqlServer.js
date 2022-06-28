const { loadFiles } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");

module.exports = async function () {
  const types = await loadFiles(path.join(__dirname, "modules/**/*.graphql"));
  const typeDefs = mergeTypeDefs(types);
  const resolverFunctions = loadResolvers();

  // The reason we are not adding jwt middleware with `app.use` is
  // that `app.use` will only call the jwt middleware per request
  // whereas composing the jwt middleware with every resolver calls
  // the middleware per query/mutation specified in a single request
  const resolversComposition = {
    "*.*": [middlewares.graphql.compose(middlewares.jwt, true)],
  };
  const resolvers = composeResolvers(
    mergeResolvers(resolverFunctions),
    resolversComposition
  );

  const apolloServer = new apolloServerExpress.ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      apolloServerCore.ApolloServerPluginDrainHttpServer({
        httpServer,
      }),
    ],
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: constants.GRAPHQL_PATH });
  console.log(`🚀 Apollo Server ready at ${apolloServer.graphqlPath}`);
};

function loadResolvers() {
  const resolverFunctions = [];
  for (let [index, actionFile] of utils.globalFile
    .getGlobbedFiles("./**/*.resolver.js")
    .entries()) {
    const filePathArr = actionFile.split("/");
    const requestName = utils.capitalizeFirstLetter(
      filePathArr[filePathArr.length - 2]
    );
    const splittedFileNameArray =
      filePathArr[filePathArr.length - 1].split(".");
    const fileName =
      splittedFileNameArray.length === 3 ? undefined : splittedFileNameArray[1];
    const actionsObject = require(path.resolve(`${actionFile}`));
    resolverFunctions[index] = {
      ...(resolverFunctions?.[index] && resolverFunctions?.[index]),
      [requestName]: fileName
        ? {
            ...(resolverFunctions[index]?.[requestName] &&
              resolverFunctions[index]?.[requestName]),
            [fileName]: actionsObject,
          }
        : {
            ...(resolverFunctions[index]?.[requestName] &&
              resolverFunctions[index]?.[requestName]),
            ...actionsObject,
          },
    };
  }
  return resolverFunctions;
}
