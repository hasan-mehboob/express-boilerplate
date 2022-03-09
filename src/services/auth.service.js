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
    await libs.email_service.sendEmail(user);
    var token = utils.token.getJWTToken(user);
    user.dataValues.accessToken = token;
    return user;
  }

  async verifyEmail(payload) {
    const user = await this.model.findOne({
      where: {
        [Op.or]: [
          {
            email: payload.user,
          },
          {
            telephoneNumber: payload.user,
          },
        ],
      },
    });

    if (!user) {
      throw createError(400, messages.userNotFound);
    }
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
                telephoneNumber: user.telephoneNumber,
              }
            : { telephoneNumber: true, email: user.email }),
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
    user = await crudService.updateVerification({
      isEmail,
      id,
      message: messages.userNotFound,
    });
    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    // FIXME: send code according to isEmail
    await libs.email_service.sendEmail(user);

    return user;
  }
}

exports.AuthService = AuthService;
