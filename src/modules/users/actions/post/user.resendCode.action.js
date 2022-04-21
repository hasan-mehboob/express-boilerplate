const authService = new services.AuthService(models.Users);
const crudService = new services.CrudService(models.Users);

module.exports = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await authService.resendCode(body, crudService);

    return res.json({
      status: 200,
      message: messages.resendCode,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
