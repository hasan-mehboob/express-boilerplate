exports.getJWTToken = function (user) {
  let { TOKEN_EXPIRY } = process.env;
  const payload = _.pick(user, ["id", "email"]);
  return jwt.sign(payload, process.env.JWTSECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};
