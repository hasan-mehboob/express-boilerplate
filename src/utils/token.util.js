exports.getJWTToken = function ({ secret, expiry, payload }) {
  return jwt.sign(payload, secret, {
    expiresIn: dataConstraint.isValidNumber.test(expiry)
      ? parseInt(expiry)
      : expiry,
  });
};
exports.verifyToken = function ({ secret, token }) {
  return jwt.verify(token, secret);
};
