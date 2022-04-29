const roleModel = {
  users: models.Users,
  admins: models.Admins,
};
router.use(function (req, res, next) {
  let isChecked = 0;
  for (let route in roleModel) {
    if (req.path.search(`${route}/`) != -1 && !isChecked) {
      req.roleModel = roleModel[route];
      isChecked = 1;
    }
  }
  if (!req.roleModel) {
    try {
      const jwtPayload = utils.token.verifyToken({
        token: req.cookies.accessToken,
        secret: auth.accessToken.secret,
      });
      req.roleModel = roleModel[jwtPayload.model];
    } catch (error) {}
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
