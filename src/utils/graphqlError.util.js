module.exports = function graphqlError(err) {
  if (err.status === 400) {
    return new apolloServerExpress.UserInputError(err.message);
  } else if (err.status === 401) {
    return new apolloServerExpress.AuthenticationError(err.message);
  } else if (err.status === 403) {
    return new apolloServerExpress.ForbiddenError(err.message);
  } else if (err.status === 404) {
    return new apolloServerExpress.ApolloError(
      err.message,
      "RESOURCE_NOT_FOUND"
    );
  } else {
    return new apolloServerExpress.ApolloError(err.message);
  }
};
