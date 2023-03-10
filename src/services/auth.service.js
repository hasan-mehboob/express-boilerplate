class AuthService {
  constructor(model) {
    this.model = model;
  }

  async signUp(payload, req) {
    const user = await this.model.findOne({
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
    const { hash, salt } = utils.hash.makeHashValue(payload.password);
    payload.salt = salt;
    payload["password"] = hash;
    const userData = await this.model.create(payload);
    await libs.email_service.sendVerificationCode(
      userData,
      userData.verificationCode.email
    );
    var { accessToken, refreshToken } = models.Users.getjwtToken({
      user: userData,
    });
    userData.dataValues.accessToken = accessToken;
    const { hash: refreshTokenHash, salt: refreshTokenSalt } =
      utils.hash.makeHashValue(refreshToken);
    await models.RefreshTokens.create({
      userId: userData.id,
      modelType: "Users",
      token: refreshTokenHash,
      salt: refreshTokenSalt,
    });
    await helpers.userDevices.create({
      ...req,
      user: { id: userData.id, accessToken },
    });
    return {
      data: userData,
      refreshToken,
    };
  }
  async verifyCode(body) {
    const user = await this.model.findOne({
      where: {
        ...(body.isEmail
          ? {
              email: body.emailOrPhoneNumber,
            }
          : {
              telephoneNumber: body.emailOrPhoneNumber,
              countryCode: body.countryCode,
            }),
      },
    });
    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    const verificationCode = body.isEmail
      ? user.verificationCode.email
      : user.verificationCode.telephoneNumber;
    if (verificationCode !== body.code && body.code !== 0) {
      throw createError(400, messages.invalidCode);
    }
    const payload = {};
    if (body.isEmail)
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

    const userIns = await this.model.update(payload, {
      where: {
        id: user.id,
      },
      individualHooks: true,
      returning: true,
    });
    return userIns[1][0];
  }

  async resendCode(payload, crudService) {
    let user = await this.model.findOne({
      where: {
        ...(payload.isEmail
          ? {
              email: payload.emailOrPhoneNumber,
            }
          : {
              telephoneNumber: payload.emailOrPhoneNumber,
              countryCode: payload.countryCode,
            }),
      },
    });
    if (!user) return createError(messages.userNotFound);
    user = await this.verification({
      isEmail: payload.isEmail,
      user,
      crudService,
    });
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
      return userData;
    } catch (error) {
      throw createError(error);
    }
  }
}

exports.AuthService = AuthService;
