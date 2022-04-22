const authService = new services.AuthService(models.Users);

module.exports = async (req, res, next) => {
  const { body: payload } = req;
  try {
    payload.signupStage = constants.SIGNUP_STAGES.VERIFY_CODE;
    const Users = await authService.signUp(payload, req);
    return res.json({
      status: 200,
      message: messages.created("Users"),
      data: Users,
    });
  } catch (err) {
    next(err);
  }
};
