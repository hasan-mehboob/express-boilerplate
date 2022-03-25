class AuthService {
  constructor(model) {
    this.model = model;
  }

  async signUp(payload) {
    let user = await this.model.findOne({
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
    payload["password"] = utils.hash.makeHashValue(payload.password);
    user = await this.model.create(payload);
    await libs.email_service.sendVerificationCode(
      user,
      user.verificationCode.email
    );
    var token = utils.token.getJWTToken(user);
    user.dataValues.accessToken = token;
    return user;
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

    let userIns = await this.model.update(
      {
        isVerified: {
          ...(isEmail
            ? {
                email: true,
                telephoneNumber: user.isVerified.telephoneNumber,
              }
            : { telephoneNumber: true, email: user.isVerified.email }),
        },
        ...(user?.signupStage !== constants.SIGNUP_STAGES.SUCCESS
          ? {
              signupStage: constants.SIGNUP_STAGES.COMPLETE_PROFILE,
            }
          : null),
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return userIns;
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
      await crudService.update(
        {
          verificationCode: {
            ...(isEmail
              ? {
                  email: verificationCode,
                  telephoneNumber: user?.verificationCode?.telephoneNumber,
                }
              : {
                  telephoneNumber: verificationCode,
                  email: user?.verificationCode?.email,
                }),
          },
          codeExpiryTime: {
            ...(isEmail
              ? {
                  email: codeExpiryTime,
                  telephoneNumber: user?.codeExpiryTime?.telephoneNumber,
                }
              : {
                  telephoneNumber: codeExpiryTime,
                  email: user?.codeExpiryTime?.email,
                }),
          },
        },
        user.id,
        messages.userNotFound
      );
      const userData = await models.Users.findByPk(user.id);
      if (isEmail)
        await libs.email_service.sendVerificationCode(
          userData,
          isEmail
            ? userData.verificationCode.email
            : userData.verificationCode.telephoneNumber
        );
      else
        libs.sms_service.sendVerificationCode(
          userData,
          isEmail
            ? userData.verificationCode.email
            : userData.verificationCode.telephoneNumber
        );
      userData.token = utils.token.getJWTToken(userData);
      return userData;
    } catch (error) {
      throw createError(error);
    }
  }
}

exports.AuthService = AuthService;
