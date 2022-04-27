const authService = new services.AuthService(models.Users);

module.exports = async (req, res, next) => {
  const { body: payload } = req;
  try {
    payload.signupStage = constants.SIGNUP_STAGES.VERIFY_CODE;
    const { data, accessToken, refreshToken } = await authService.signUp(
      payload,
      req
    );
    utils.cookie.setCookies({
      res,
      cookies: [
        {
          cookieName: "accessToken",
          value: accessToken,
        },
        {
          cookieName: "refreshToken",
          value: refreshToken,
        },
      ],
    });
    return res.json({
      status: 200,
      message: messages.created("Users"),
      data,
    });
  } catch (err) {
    next(err);
  }
};
