exports.generateSalt = () => {
  return crypto.randomBytes(16).toString("base64");
};
