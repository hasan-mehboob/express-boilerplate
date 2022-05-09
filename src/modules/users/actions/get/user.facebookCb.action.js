const crudService = new services.CrudService(models.Users);
module.exports = async (req, res, next) => {
  const { user } = req;
  const { accessToken, refreshToken } = models.Users.getjwtToken({ user });
  let payload = {};
  if (accessToken) {
    if (user.signupStage !== constants.SIGNUP_STAGES.SUCCESS) {
      Object.assign(payload, {
        signupStage: constants.SIGNUP_STAGES.COMPLETE_PROFILE,
        isVerified: {
          telephoneNumber: false,
          email: true,
        },
      });
    } else
      Object.assign(payload, {
        telephoneNumber: user.isVerified.telephoneNumber,
        isVerified: {
          email: true,
        },
      });
    const userDevice = await helpers.userDevices.get(req);
    if (!userDevice)
      await helpers.userDevices.create({
        ...req,
        user: { id: user.id, accessToken },
      });
    else
      await helpers.userDevices.update({
        ...req,
        user: { id: user.id, accessToken },
      });
    await crudService.update(payload, user.id, messages.userNotFound);
    res.redirect(
      process.env.FRONTEND_URL +
        "/auth/callback?token=" +
        accessToken +
        "&refreshToken=" +
        refreshToken
    );
  } else {
    throw createError(400, messages.badRequest);
  }
};
