const authService = new services.AuthService(models.Users);

module.exports = async (req, res, next) => {
  try {
    const { body: payload } = req;
    payload.code = parseInt(req.body.code);
    const user = await authService.verifyCode(payload);
    return res.json({
      status: 200,
      message: messages.verified,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
