const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);
module.exports = async (req, res, next) => {
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
};
