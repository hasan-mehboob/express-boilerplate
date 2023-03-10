const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
const { JWTSECRET } = process.env;

ExtractJwt.fromBodyField("token");
const opts = { passReqToCallback: true, secretOrKey: JWTSECRET };

module.exports = function () {
  opts.jwtFromRequest = function (request) {
    if (request.cookies.accessToken)
      request.jwtToken = request.cookies.accessToken;
    if (request.headers.token) request.jwtToken = request.headers.token;
    return request.jwtToken;
  };

  passport.use(
    new JwtStrategy(opts, async (req, jwtPayload, done) => {
      try {
        if (!jwtPayload.id || !jwtPayload.model || !jwtPayload.email) {
          process.nextTick(function () {
            done({ status: 401, message: messages.invalidToken }, null);
          });
        } else {
          const refreshToken =
            req.cookies.refreshtoken ?? req.headers.refreshtoken;
          if (!refreshToken)
            done(
              { status: 404, message: messages.notFound("Refresh Token") },
              null
            );
          const userRefreshToken = await models.RefreshTokens.findOne({
            where: {
              userId: jwtPayload.id,
              modelType: models[jwtPayload.model].tableName,
            },
          });
          const verify = utils.token.verifyToken({
            token: refreshToken,
            secret: auth.refreshToken.secret,
          });
          if (
            !verify ||
            utils.hash.makeHashValue(refreshToken, userRefreshToken.salt)
              .hash !== userRefreshToken.token
          )
            done({ status: 401, message: messages.invalidToken }, null);
          let customError = {
            message: messages.invalidToken,
            status: 401,
          };

          let model;
          if (jwtPayload.model) {
            model = models[jwtPayload.model];
          } else {
            done(customError, false);
          }

          let user = await model.findByPk(jwtPayload.id);
          user.tableName = model.tableName;
          user.refreshToken = refreshToken;
          user ? done(null, user) : done(customError, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );
};
