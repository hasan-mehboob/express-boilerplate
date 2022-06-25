const { USER_ROLE } = constants;
const roleModel = {
  users: models[USER_ROLE.USER],
  admins: models[USER_ROLE.ADMIN],
};
router.use(function (req, res, next) {
  let doesModelExist = 0;
  // This field is used in Signup/Login Strategies to authenticate the user
  // according to his route
  // e.g if someone makes a request on /users/auth/login route then he will be
  // authenticated according to the users value in roleModel which is models.Users
  for (let route in roleModel) {
    if (req.path.search(`/${route}`) != -1 && !doesModelExist) {
      req.roleModel = roleModel[route];
      doesModelExist = 1;
    }
  }

  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    req.user = user;
    if (err || !user) {
      if (
        utils.isObjInArray(constants.PUBLIC_ROUTES, {
          method: req.method,
          path: req.path,
        })
      ) {
        next();
      } else {
        let errMsg = info ? info.message : err.message;
        if (errMsg.toLowerCase() == "jwt expired".toLowerCase()) {
          errMsg = messages.sessionExpiry;
        }
        next(createError(401, errMsg));
      }
    } else {
      next();
    }
  })(req, res, next);
});
