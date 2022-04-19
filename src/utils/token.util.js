exports.getJWTToken = function (user, model) {
  let { TOKEN_EXPIRY } = process.env;
  const payload = _.pick(user, ["id", "email"]);
  payload.model = model;
  return jwt.sign(payload, process.env.JWTSECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};
