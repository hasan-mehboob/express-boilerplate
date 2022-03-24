class CrudService {
  constructor(model) {
    this.model = model;
  }

  async add(payload) {
    return await this.model.create(payload);
  }

  async update(payload, id, message) {
    let model = await this.model.update({ ...payload }, { where: { id } });
    if (!model) {
      throw createError(404, message);
    }
    return model;
  }
  async updateVerification({ isEmail, id, message }) {
    const verificationCode = utils.random.generateRandomNumber();
    const codeExpiryTime = Date.now();
    let model = await this.model.update(
      {
        ...(isEmail
          ? {
              "verificationCode.email": verificationCode,
              "codeExpiryTime.email": codeExpiryTime,
            }
          : {
              "verificationCode.telephoneNumber": verificationCode,
              "codeExpiryTime.telephoneNumber": codeExpiryTime,
            }),
      },
      {
        where: {
          id,
        },
      }
    );
    if (!model) {
      throw createError(404, message);
    }
    return model;
  }

  async getModelById(id, notFoundMessage) {
    let model = await this.model.findByPk(id);

    if (!model) {
      throw createError(404, notFoundMessage);
    }
    return model;
  }
  async getModelByUserName(payload) {
    const user = await this.model.findOne({
      where: {
        [Op.or]: [
          {
            email: payload.userName,
          },
          {
            telephoneNumber: payload.userName,
            countryCode: payload.countryCode,
          },
        ],
      },
    });

    if (!user) {
      throw createError(400, messages.userNotFound);
    }
    return user;
  }

  async getList(attr) {
    if (attr) {
      return await this.model.find({}).sort(attr);
    }
    return await this.model.find({});
  }
  async deleteById(id) {
    return await this.model.delete({ where: { id } });
  }
}
exports.CrudService = CrudService;
