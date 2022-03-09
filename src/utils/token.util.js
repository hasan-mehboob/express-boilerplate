exports.getJWTToken = function (user) {
  let { TOKEN_EXPIRY } = process.env;
  const payload = _.pick(user, ["id", "email"]);
  return JWT.sign(payload, process.env.JWTSECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};
