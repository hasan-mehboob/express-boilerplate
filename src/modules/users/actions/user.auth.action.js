const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);

exports.auth = {
  signUp: async (req, res, next) => {
    let { body: payload } = req;
    payload = _.omit(payload, [
      "createdAt",
      "updatedAt",
      "isVerified",
      "verificationCode",
      "codeExpiryTime",
    ]);
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

  verifyCode: async (req, res, next) => {
    try {
      let {
        body: { code, isEmail },
        params: { id },
      } = req;
      code = parseInt(req.body.code);

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
        body: { isEmail },
        params: { id },
      } = req;
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
        body: { code, password, isEmail },
        params: { id },
      } = req;
      const verificationCode = parseInt(code);
      let user = await models.Users.findByPk(id);
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
      const verificationPayload = isEmail
        ? user.verificationCode.email
        : user.verificationCode.telephoneNumber;
      // FIXME: Remove hard coded value
      if (verificationPayload === verificationCode || verificationCode === 0) {
        user = await crudService.update(
          { password: utils.hash.makeHashValue(password) },
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
    const token = utils.token.getJWTToken(user);
    if (token) {
      // await crudService.update(
      //   { signupStages: SIGNUP_STAGE.SELECT_ROLE },
      //   user.id,
      //   messages.userNotFound
      // );
      res.redirect(process.env.FRONTEND_URL + "/auth/callback?token=" + token);
    } else {
      throw createError(400, messages.badRequest);
    }
  },
  facebookCb: async (req, res, next) => {
    const { user } = req;
    const token = utils.token.getJWTToken(user);

    if (token) {
      res.redirect(process.env.FRONTEND_URL + "/auth/callback?token=" + token);
    } else {
      throw createError(400, messages.badRequest);
    }
  },
};
