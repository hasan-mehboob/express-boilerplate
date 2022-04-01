class AuthService {
  constructor(model) {
    this.model = model;
  }

  async signUp(payload) {
    let user = await this.model.scope().findOne({
      where: {
        email: payload.email,
      },
    });
    if (user && user.email === payload.email) {
      throw createError(400, messages.emailExists);
    }
    payload = {
      ...payload,
      verificationCode: {
        email: utils.random.generateRandomNumber(),
        telephoneNumber: null,
      },
    };
    const salt = utils.salt.generateSalt();
    payload.salt = salt;
    payload["password"] = utils.hash.makeHashValue(payload.password, salt);
    const userData = await this.model.create(payload);
    await libs.email_service.sendVerificationCode(
      userData,
      userData.verificationCode.email
    );
    var token = utils.token.getJWTToken(userData);
    userData.dataValues.accessToken = token;
    return userData;
  }
  async verifyCode(id, code, isEmail) {
    const user = await this.model.findByPk(id);
    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    let verificationCode = isEmail
      ? user.verificationCode.email
      : user.verificationCode.telephoneNumber;
    if (verificationCode !== code && code !== 0) {
      throw createError(400, messages.invalidCode);
    }
    const payload = {};
    if (isEmail)
      Object.assign(payload, {
        isVerified: {
          email: true,
          telephoneNumber: user.isVerified.telephoneNumber,
        },
      });
    else
      Object.assign(payload, {
        isVerified: {
          telephoneNumber: true,
          email: user.isVerified.email,
        },
      });
    if (user?.signupStage !== constants.SIGNUP_STAGES.SUCCESS)
      Object.assign(payload, {
        signupStage: constants.SIGNUP_STAGES.COMPLETE_PROFILE,
      });

    let userIns = await this.model.update(payload, {
      where: {
        id: user.id,
      },
      returning: true,
    });
    return userIns[1][0];
  }

  async resendCode(id, isEmail, crudService) {
    let user = await this.model.findOne({
      where: {
        id,
      },
    });
    if (!user) return createError(messages.userNotFound);
    user = await this.verification({ isEmail, user, crudService });
    return user;
  }
  async verification({ isEmail, user, crudService }) {
    try {
      const verificationCode = utils.random.generateRandomNumber();
      const codeExpiryTime = Date.now();
      const payload = {};
      if (isEmail)
        Object.assign(payload, {
          verificationCode: {
            email: verificationCode,
            telephoneNumber: user?.verificationCode?.telephoneNumber,
          },
          codeExpiryTime: {
            email: codeExpiryTime,
            telephoneNumber: user?.codeExpiryTime?.telephoneNumber,
          },
        });
      else
        Object.assign(payload, {
          verificationCode: {
            telephoneNumber: verificationCode,
            email: user?.verificationCode?.email,
          },
          codeExpiryTime: {
            telephoneNumber: codeExpiryTime,
            email: user?.codeExpiryTime?.email,
          },
        });

      const userData = await crudService.update(
        payload,
        user.id,
        messages.userNotFound
      );
      if (isEmail)
        await libs.email_service.sendVerificationCode(
          userData,
          isEmail
            ? userData?.verificationCode?.email
            : userData?.verificationCode?.telephoneNumber
        );
      else
        libs.sms_service.sendVerificationCode(
          userData,
          isEmail
            ? userData?.verificationCode?.email
            : userData?.verificationCode?.telephoneNumber
        );
      userData.token = utils.token.getJWTToken(userData);
      return userData;
    } catch (error) {
      throw createError(error);
    }
  }
}

exports.AuthService = AuthService;
