class AuthService {
  constructor(model) {
    this.model = model;
  }

  async signUp(payload) {
    let user = await this.model.findOne({
      where: {
        [Op.or]: [
          { email: payload.email },
          { telephoneNumber: payload.telephoneNumber },
        ],
      },
    });
    if (user && user.email === payload.email) {
      throw createError(400, messages.emailExists);
    } else if (user && user.telephoneNumber === payload.telephoneNumber) {
      throw createError(400, messages.telephoneNumberExists);
    }
    // payload.verificationCode.email = utils.random.generateRandomNumber();
    payload = {
      ...payload,
      verificationCode: {
        email: utils.random.generateRandomNumber(),
        telephoneNumber: null,
      },
    };
    payload["password"] = utils.hash.makeHashValue(payload.password);
    user = await this.model.create(payload);
    await libs.email_service.sendVerificationCode(user);
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
    const verificationCode = utils.random.generateRandomNumber();
    const codeExpiryTime = Date.now();
    user = await crudService.update(
      {
        verificationCode: {
          ...(isEmail
            ? {
                email: verificationCode,
                telephoneNumber: user.verificationCode.telephoneNumber,
              }
            : {
                telephoneNumber: verificationCode,
                email: user.verificationCode.email,
              }),
        },
        codeExpiryTime: {
          ...(isEmail
            ? {
                email: codeExpiryTime,
                telephoneNumber: user.codeExpiryTime.telephoneNumber,
              }
            : {
                telephoneNumber: codeExpiryTime,
                email: user.codeExpiryTime.email,
              }),
        },
      },
      id,
      messages.userNotFound
    );
    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    if (isEmail) await libs.email_service.sendVerificationCode(user);
    else libs.sms_service.sendVerificationCode(user);
    return user;
  }
}

exports.AuthService = AuthService;
