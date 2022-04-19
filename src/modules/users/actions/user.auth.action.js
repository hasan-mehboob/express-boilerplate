const { SIGNUP_STAGES } = require("../../../../config/constants");

const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);

exports.auth = {
  signUp: async (req, res, next) => {
    const { body: payload } = req;
    try {
      payload.signupStage = constants.SIGNUP_STAGES.VERIFY_CODE;
      const Users = await authService.signUp(payload);
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
      let { user } = req;
      user = await models.Users.findByPk(user.id);
      const token = utils.token.getJWTToken(user, "users");
      user.dataValues.accessToken = token;
      return res.json({
        status: 200,
        message: messages.signedIn,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  verifyCode: async (req, res, next) => {
    try {
      const { body: payload } = req;
      payload.code = parseInt(req.body.code);
      const user = await authService.verifyCode(payload);
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
      const { body } = req;
      const user = await authService.resendCode(body, crudService);

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
      const { body: payload } = req;
      let user = await crudService.getModelByUserName(payload);
      user = await authService.verification({
        isEmail: payload.isEmail,
        user,
        crudService,
      });
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
  },
  googleCb: async (req, res, next) => {
    const { user } = req;
    const token = utils.token.getJWTToken(user, "users");
    let payload = {};
    if (token) {
      if (user.signupStage !== constants.SIGNUP_STAGES.SUCCESS) {
        Object.assign(payload, {
          signupStage: SIGNUP_STAGES.COMPLETE_PROFILE,
          isVerified: {
            telephoneNumber: false,
            email: true,
          },
        });
      } else
        Object.assign(payload, {
          telephoneNumber: user.isVerified.telephoneNumber,
          isVerified: {
            email: true,
          },
        });
      await crudService.update(payload, user.id, messages.userNotFound);
      res.redirect(process.env.FRONTEND_URL + "/auth/callback?token=" + token);
    } else {
      throw createError(400, messages.badRequest);
    }
  },
  facebookCb: async (req, res, next) => {
    const { user } = req;
    const token = utils.token.getJWTToken(user, "users");
    let payload = {};
    if (token) {
      if (user.signupStage !== constants.SIGNUP_STAGES.SUCCESS) {
        Object.assign(payload, {
          signupStage: SIGNUP_STAGES.COMPLETE_PROFILE,
          isVerified: {
            telephoneNumber: false,
            email: true,
          },
        });
      } else
        Object.assign(payload, {
          telephoneNumber: user.isVerified.telephoneNumber,
          isVerified: {
            email: true,
          },
        });
      await crudService.update(payload, user.id, messages.userNotFound);
      res.redirect(process.env.FRONTEND_URL + "/auth/callback?token=" + token);
    } else {
      throw createError(400, messages.badRequest);
    }
  },
};
