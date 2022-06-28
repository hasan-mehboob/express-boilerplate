const { USER_ROLE } = constants;
const roleModel = {
  users: models[USER_ROLE.USER],
  admins: models[USER_ROLE.ADMIN],
};
async function jwtStrategy(req, res, next) {
  let doesModelExist = 0;
  // `req.roleModel` field is used in Signup/Login Strategies to authenticate the
  // user according to his route
  if (utils.isGraphqlRequest(req)) {
    // only add on login (for LocalStrategy) because Third Party Auth strategies
    // will only be used with REST api request
    if (req.graphqlInfo.path.key === "login") {
      req.roleModel = models[req.graphqlArgs.as];
      req.body.variables = req.graphqlArgs;
    }
  } else {
    // e.g if someone makes a request on /users/auth/login route then he will be
    // authenticated according to the `users` value in roleModel which is `models.Users`
    for (let route in roleModel) {
      if (req.path.search(`/${route}`) != -1 && !doesModelExist) {
        req.roleModel = roleModel[route];
        doesModelExist = 1;
      }
    }
  }

  try {
    await new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        function (err, user, info) {
          req.user = user;
          if (err || !user) {
            if (
              utils.isGraphqlRequest(req) &&
              utils.isGraphqlPublicRoute(req)
            ) {
              resolve();
            }
            if (
              utils.isObjInArray(constants.PUBLIC_ROUTES, {
                method: req.method,
                path: req.path,
              })
            ) {
              resolve();
            } else {
              let errMsg = info ? info.message : err.message;
              if (errMsg.toLowerCase() == "jwt expired".toLowerCase()) {
                errMsg = messages.sessionExpiry;
              }
              reject(createError(401, errMsg));
            }
          } else {
            resolve();
          }
        }
      )(req, res, next);
    });
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = jwtStrategy;

router.use(jwtStrategy);
