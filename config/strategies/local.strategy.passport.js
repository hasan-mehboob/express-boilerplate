"use strict";

const { Strategy: LocalStrategy } = passportLocal;
module.exports = function (
  passportName = "local",
  usernameField = "email",
  passwordField = "password"
) {
  // Use local strategy
  passport.use(
    passportName,
    new LocalStrategy(
      {
        usernameField,
        passwordField,
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const model = req.roleModel;
          let user = await model.findOne({
            where: {
              email,
            },
            attributes: ["password", "salt", "id"],
          });
          if (
            !user ||
            user.password !== utils.hash.makeHashValue(password, user.salt).hash
          ) {
            return done(null, false, { message: messages.invalidLogin });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
