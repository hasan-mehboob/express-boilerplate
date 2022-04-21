const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);
module.exports = async (req, res, next) => {
  try {
    const {
      body: { code, emailOrPhoneNumber, countryCode, password, isEmail },
    } = req;
    const verificationCode = parseInt(code);
    let user = await models.Users.findOne({
      where: {
        ...(isEmail
          ? {
              email: emailOrPhoneNumber,
            }
          : {
              telephoneNumber: emailOrPhoneNumber,
              countryCode: countryCode,
            }),
      },
    });
    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    const currentTime = Date.now();
    // It will be empty when no request had been made for resetPassword
    if (!user.codeExpiryTime) {
      throw createError(400, messages.invalidCode);
    }
    if (currentTime - user.codeExpiryTime > dataConstraint.CODE_EXPIRY_TIME) {
      throw createError(400, messages.codeExpried);
    }
    const salt = utils.salt.generateSalt();
    const verificationPayload = isEmail
      ? user.verificationCode.email
      : user.verificationCode.telephoneNumber;
    // FIXME: Remove hard coded value
    if (verificationPayload === verificationCode || verificationCode === 0) {
      user = await crudService.update(
        { password: utils.hash.makeHashValue(password, salt), salt },
        user.id,
        messages.userNotFound
      );
      return res.json({
        status: 200,
        message: messages.updateAttr("Password"),
        data: user,
      });
    } else throw createError(400, messages.invalidCode);
  } catch (err) {
    next(err);
  }
};
