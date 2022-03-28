const {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  USER_FACEBOOK_CALLBACK,
  BASE_URL,
} = process.env;

const FacebookStrategy = require("passport-facebook").Strategy;
module.exports = function (passportName) {
  const callbackURL = BASE_URL + USER_FACEBOOK_CALLBACK;

  passport.use(
    passportName,
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL,
        profileFields: [
          "id",
          "email",
          "gender",
          "link",
          "locale",
          "name",
          "timezone",
          "updated_time",
          "verified",
          "picture.type(large)",
        ],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const model = req.roleModel;

          var user = await model.findOne({
            where: {
              transportUid: profile.id,
            },
          });
          if (!user) {
            user = await model.create({
              email: profile.emails[0].value,
            });
            await helpers.createUserSocialAccount({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              fullName: `${profile.name.givenName} ${profile.name.familyName}`,
              transportUid: profile.id,
              userId: user.id,
              provider: profile.provider,
              accessToken: accessToken,
              email: profile.emails[0].value,
              profilePhoto: profile.photos ? profile.photos[0].value : "",
            });
          } else {
            const isSocialAvailable = await models.UserSocialAccounts.findOne({
              where: {
                transportUid: profile.id,
              },
            });
            if (!isSocialAvailable)
              helpers.createUserSocialAccount({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                fullName: `${profile.name.givenName} ${profile.name.familyName}`,
                transportUid: profile.id,
                userId: user.id,
                provider: profile.provider,
                accessToken: accessToken,
                email: profile.emails[0].value,
                profilePhoto: profile.photos ? profile.photos[0].value : "",
              });
          }
          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
