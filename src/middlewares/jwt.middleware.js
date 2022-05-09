const roleModel = {
  users: models.Users,
  admins: models.Admins,
};
router.use(function (req, res, next) {
  let doesModelExist = 0;
  for (let route in roleModel) {
    if (req.path.search(`${route}/`) != -1 && !doesModelExist) {
      req.roleModel = roleModel[route];
      doesModelExist = 1;
    }
  }

  passport.authenticate("jwt", { session: false }, function (err, user, info) {
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
      req.user = user;
      next();
    }
  })(req, res, next);
});
