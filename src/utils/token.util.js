exports.getJWTToken = function ({ secret, expiry, payload }) {
  return jwt.sign(payload, secret, {
    expiresIn: /^\d+$/.test(expiry) ? parseInt(expiry) : expiry,
  });
};
