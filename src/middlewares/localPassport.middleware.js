exports.authenticate = async (req, res, next) => {
  try {
    let strategyName = "local";
    if (utils.isGraphqlRequest(req)) {
      strategyName = "local-graphql";
    }
    await new Promise((resolve, reject) => {
      passport.authenticate(
        strategyName,
        { session: false },
        function (err, user, info) {
          if (err || !user) {
            reject(createError(401, err));
          } else {
            req.user = user;
            resolve();
          }
        }
      )(req, res, next);
    });
    return next();
  } catch (err) {
    return next(err);
  }
};
