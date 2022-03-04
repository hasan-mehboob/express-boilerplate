class CrudService {
  constructor(model) {
    this.model = model;
  }

  async add(payload) {
    return await this.model.create(payload);
  }

  async update(payload, id, message) {
    let model = await this.model.update({ payload }, { where: { id } });
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
