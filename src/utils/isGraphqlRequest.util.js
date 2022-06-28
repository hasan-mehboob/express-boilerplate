module.exports = function isGraphqlRequest(req) {
  return req.method === "POST" && req.baseUrl === constants.GRAPHQL_PATH;
};
