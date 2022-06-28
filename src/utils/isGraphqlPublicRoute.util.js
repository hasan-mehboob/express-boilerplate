const { PUBLIC_GRAPHQL_ROUTES } = constants;

module.exports = function isGraphqlPublicRoute(req) {
  const { path } = req.graphqlInfo;
  for (let key in PUBLIC_GRAPHQL_ROUTES) {
    if (key === path.typename) {
      const items = PUBLIC_GRAPHQL_ROUTES[key];
      if (Array.isArray(items)) {
        return items.includes(path.key);
      } else if (typeof items === "string") {
        return items === path.key;
      }
    }
  }
  return false;
};
