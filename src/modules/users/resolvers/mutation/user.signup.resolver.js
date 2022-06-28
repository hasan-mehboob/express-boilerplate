const authService = new services.AuthService(models.Users);

module.exports = async (_, args, { req }) => {
  args.signupStage = constants.SIGNUP_STAGES.VERIFY_CODE;
  const { data, refreshToken } = await authService.signUp(args, req);
  data.dataValues.refreshToken = refreshToken;
  return data;
};
