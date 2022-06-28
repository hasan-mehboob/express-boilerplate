// Allows middleware chaining just like express with a custom
// `next()` function (because graphql doesn't come with one)
module.exports = function graphqlChain(...middlewares) {
  return async (root, args, context = {}, info) => {
    const { req, res } = context;
    let counter = 0;
    function next(err) {
      if (err) {
        return utils.graphqlError(err);
      }
      if (middlewares.length && middlewares.length > counter) {
        if (middlewares.length - 1 === counter) {
          return middlewares[counter++](root, args, context, info);
        } else {
          return middlewares[counter++](req, res, next);
        }
      }
    }
    return next();
  };
};

// a wrapper around @graphql-tools/resolvers-composition middleware
// This middleware is being used to wrap around all the requests to
// perform some essential tasks.
// - To verify jwt token before every request
// - To handle the errors thrown by jwt.middleware & jwt.strategy
// - To add the apollo `info` object to `req.graphqlInfo`
//   which is being used to allow public request
// - To add the apollo `args` object to `req.graphqlArgs`
//   which is being used to get the user model name & user,
//   credentials from the payload for LocalStrategy
// - To simulate the `res.send` or `res.json` behavior of express
//   so that the object is converted into it's JSON form
//   some libraries, especially ORMs & ODMs, use this method
//   to convert their model instance into raw object
//
module.exports.compose = function graphqlCompose(fn, last = false) {
  return (next) =>
    async (root, args, context = {}, info) => {
      const { req, res } = context;
      req.graphqlInfo = info;
      req.graphqlArgs = args;
      function nextWrapper(err) {
        if (err) return utils.graphqlError(err);
        if (last) {
          return next(root, args, context, info);
        } else {
          return next(req, res, nextWrapper);
        }
      }
      const resolvedValue = await fn(req, res, nextWrapper);
      if (resolvedValue?.toJSON && !(resolvedValue instanceof Error)) {
        return resolvedValue?.toJSON();
      } else {
        return resolvedValue;
      }
    };
};
