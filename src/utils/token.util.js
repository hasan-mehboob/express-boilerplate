exports.getJWTToken = function ({ secret, expiry, payload }) {
  return jwt.sign(payload, secret, {
    expiresIn: dataConstraint.IS_VALID_NUMBER_REGEX.test(expiry)
      ? parseInt(expiry)
      : expiry,
  });
};
exports.verifyToken = function ({ secret, token }) {
  return jwt.verify(token, secret);
};
