const crudService = new services.CrudService(models.Users);
module.exports = async (req, res, next) => {
  const { user } = req;
  const token = utils.token.getJWTToken(user, "users");
  let payload = {};
  if (token) {
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
        user: { id: user.id, token },
      });
    else
      await helpers.userDevices.update({
        ...req,
        user: { id: user.id, token },
      });
    await crudService.update(payload, user.id, messages.userNotFound);
    res.redirect(process.env.FRONTEND_URL + "/auth/callback?token=" + token);
  } else {
    throw createError(400, messages.badRequest);
  }
};
