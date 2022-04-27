exports.getJWTToken = function ({ secret, expiry, payload }) {
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};
