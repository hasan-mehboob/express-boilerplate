const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
const { JWTSECRET } = process.env;
const roleModel = {
  users: models.Users,
  admins: models.Admins,
};
ExtractJwt.fromBodyField("token");
const opts = { passReqToCallback: true, secretOrKey: JWTSECRET };

module.exports = function () {
  opts.jwtFromRequest = function (request) {
    var token = null;
    // if (request.header("authorization")) {
    //   token = request.header("authorization").trim().split(" ").pop();
    // } else if (request.query.jwtToken) {
    //   token = request.query.jwtToken;
    // }
    if (request.cookies.accessToken) token = request.cookies.accessToken;
    request.jwtToken = token;
    return token;
  };

  passport.use(
    new JwtStrategy(opts, async (req, jwt_payload, done) => {
      try {
        if (!jwt_payload.id || !jwt_payload.model || !jwt_payload.email) {
          process.nextTick(function () {
            done({ status: 401, message: messages.InvalidToken }, null);
          });
        } else {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken)
            done(
              { status: 404, message: messages.notFound("Refresh Token") },
              null
            );
          const verify = await utils.token.verifyToken({
            token: refreshToken,
            secret: auth.refreshToken.secret,
          });
          if (!verify)
            done({ status: 401, message: messages.InvalidToken }, null);
          let customError = {
            message: "Invalid Token",
            status: 401,
          };

          let model = req.roleModel;
          if (jwt_payload.model && !model) {
            model = roleModel[jwt_payload.model];
          }
          let user = await model.findByPk(jwt_payload.id);
          user
            ? done(null, {
                ...user,
                tableName: model.tableName,
              })
            : done(customError, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );
};
