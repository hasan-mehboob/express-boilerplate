exports.format = (req, res, next) => {
  const { body: payload } = req;
  if (payload && payload.email) payload.email = payload.email.toLowerCase();
  if (payload && payload.emailOrPhoneNumber) {
    const isEmail = dataConstraint.EMAIL_REGEX.test(payload.emailOrPhoneNumber);
    if (isEmail) {
      payload.emailOrPhoneNumber = payload.emailOrPhoneNumber.toLowerCase();
      payload.isEmail = true;
    } else payload.isEmail = false;
  }
  next();
};
