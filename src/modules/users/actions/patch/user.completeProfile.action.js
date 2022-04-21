const crudService = new services.CrudService(models.Users);

module.exports = async (req, res, next) => {
  try {
    let { body: payload, user } = req;
    const exsistingPhoneNumber = await models.Users.findOne({
      where: {
        telephoneNumber: payload.telephoneNumber,
        countryCode: payload.countryCode,
      },
    });
    if (exsistingPhoneNumber) {
      throw createError(400, messages.telephoneNumberExists);
    }
    const updatedUser = await crudService.update(
      { ...payload, signupStage: constants.SIGNUP_STAGES.SUCCESS },
      user.id,
      messages.userNotFound
    );
    return res.json({
      status: 200,
      message: messages.updatedModel("User"),
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
