const auth = {
  accessToken: {
    secret: process.env.JWTSECRET,
    expiry: process.env.ACCESS_TOKEN_EXPIRY,
  },
  refreshToken: {
    secret: process.env.JWTSECRET,
    expiry: process.env.REFRESH_TOKEN_EXPIRY,
    remember_me_expiry: process.env.REFRESH_TOKEN_REMEMBER_ME_EXPIRY,
  },
};
module.exports = auth;

global.auth = auth;
