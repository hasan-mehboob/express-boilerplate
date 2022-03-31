"use strict";

const { Strategy: LocalStrategy } = passportLocal;
module.exports = function () {
  // Use local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const model = req.roleModel;
          let user = await model.findOne({
            where: {
              email,
            },
          });
          if (
            !user ||
            user.password !== utils.hash.makeHashValue(password, user.salt)
          ) {
            return done(null, false, { message: messages.invalidLogin });
          }
          user = utils.filterAttributes.excludeAttributes(
            user,
            model.excludedAttributes
          );
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
