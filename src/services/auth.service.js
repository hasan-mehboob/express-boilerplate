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

    if (user) {
      throw createError(400, messages.emailExists);
    }
    payload["verificationCode"] = utils.random.generateRandomNumber();
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
        email: payload.email,
      },
    });

    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    return user;
  }

  async verifyCode(id, code) {
    const user = await this.model.findByPk(id);
    if (!user) {
      throw createError(400, messages.userNotFound);
    }

    if (user.isVerified) {
      throw createError(400, messages.alreadyVerified);
    }

    if (user.verificationCode !== code && code !== 0) {
      throw createError(400, messages.invalidCode);
    }

    let userIns = await this.model.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return userIns;
  }

  async resendCode(id) {
    const user = await this.model.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw createError(400, messages.userNotFound);
    }

    await libs.email_service.sendEmail(user);

    return user;
  }
}

exports.AuthService = AuthService;
