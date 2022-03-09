const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);

exports.auth = {
  signUp: async (req, res, next) => {
    const { body: payload } = req;
    try {
      let Users = await authService.signUp(payload);

      return res.json({
        status: 200,
        message: messages.created("Users"),
        data: Users,
      });
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const token = utils.token.getJWTToken(req.user);
      req.user.accessToken = token;
      return res.json({
        status: 200,
        message: messages.signedIn,
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  },

  verifyEmail: async (req, res, next) => {
    try {
      let { body: payload } = req;
      let user = await authService.verifyEmail(payload);

      res.json({
        status: 200,
        message: messages.success,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyCode: async (req, res, next) => {
    try {
      let {
        body: { userName, code },
        params: { id },
      } = req;
      code = parseInt(req.body.code);
      const isEmail = dataConstraint.EMAIL_REGEX.test(userName);

      let user = await authService.verifyCode(id, code, isEmail);
      return res.json({
        status: 200,
        message: messages.verified,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  resendCode: async (req, res, next) => {
    try {
      const {
        body: { userName },
        params: { id },
      } = req;
      const isEmail = dataConstraint.EMAIL_REGEX.test(userName);
      let user = await authService.resendCode(id, isEmail, crudService);

      return res.json({
        status: 200,
        message: messages.resendCode,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      let { body: payload } = req;
      let user = await authService.verifyEmail(payload);
      const isEmail = dataConstraint.EMAIL_REGEX.test(payload.user);
      user = await crudService.updateVerification({
        isEmail,
        id: user.id,
        message: messages.userNotFound,
      });
      // FIXME: send email and phoneNumber
      await libs.email_service.sendEmail(user);
      user.token = utils.token.getJWTToken(user);
      return res.json({
        status: 200,
        message: messages.success,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const {
        body: { code, password, userName },
        params: { id },
      } = req;
      const verificationCode = parseInt(code);
      let user = await models.Users.findByPk(id);
      if (!user) {
        throw createError(400, messages.userNotFound);
      }
      const isEmail = dataConstraint.EMAIL_REGEX.test(userName);
      const currentTime = Date.now();
      // It will be empty when no request had been made for resetPassword
      if (!user.codeExpiryTime) {
        throw createError(400, messages.invalidCode);
      }
      if (currentTime - user.codeExpiryTime > dataConstraint.CODE_EXPIRY_TIME) {
        throw createError(400, messages.codeExpried);
      }
      const verificationPayload = isEmail
        ? user.emailVerificationCode
        : user.phoneVerificationCode;
      // FIXME: Remove hard coded value
      if (verificationPayload !== verificationCode || verificationCode !== 0) {
        throw createError(400, messages.invalidCode);
      }
      user = await crudService.update(
        { password },
        user.id,
        messages.userNotFound
      );
      return res.json({
        status: 200,
        message: messages.updateAttr("Password"),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};
