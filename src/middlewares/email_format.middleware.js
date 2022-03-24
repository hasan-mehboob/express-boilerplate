exports.format = (req, res, next) => {
  const { body: payload } = req;
  if (payload && payload.email) payload.email = payload.email.toLowerCase();
  if (payload && payload.userName) {
    const isEmail = dataConstraint.EMAIL_REGEX.test(payload.userName);
    if (isEmail) {
      payload.userName = payload.userName.toLowerCase();
      payload.isEmail = true;
    } else payload.isEmail = false;
  }
  next();
};
