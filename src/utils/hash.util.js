const { HASH_ALGO: algorithm } = process.env;
exports.makeHashValue = (text, salt) => {
  if (!salt) salt = utils.salt.generateSalt();
  const hmac = crypto.createHmac(algorithm, salt);
  hmac.update(text);
  return {
    hash: hmac.digest("hex"),
    salt,
  };
};
