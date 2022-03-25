const crudService = new services.CrudService(models.Users);
const authService = new services.AuthService(models.Users);

exports.update = {
  updateUser: async (req, res, next) => {
    try {
      let { body: payload, user } = req;
      payload = _.omit(payload, [
        "createdAt",
        "updatedAt",
        "isVerified",
        "verificationCode",
        "codeExpiryTime",
      ]);
      if (
        payload.telephoneNumber &&
        payload.telephoneNumber !== user.telephoneNumber
      ) {
        await authService.verification({ isEmail: false, user, crudService });
        Object.assign(payload, {
          isVerified: {
            email: user?.isVerified?.email,
            telephoneNumber: false,
          },
        });
      } else if (payload.email && payload.email !== user.email) {
        await authService.verification({ isEmail: true, user, crudService });
        Object.assign(payload, {
          isVerified: {
            email: false,
            telephoneNumber: user?.isVerified?.telephoneNumber,
          },
        });
      }
      if (payload.password)
        payload["password"] = utils.hash.makeHashValue(payload.password);
      await crudService.update({ ...payload }, user.id, messages.userNotFound);
      const userData = await models.Users.findByPk(user.id);
      return res.json({
        status: 200,
        message: messages.updatedModel("User"),
        data: userData,
      });
    } catch (err) {
      next(err);
    }
  },
  completeProfile: async (req, res, next) => {
    try {
      let { body: payload, user } = req;
      payload = _.omit(payload, [
        "createdAt",
        "updatedAt",
        "isVerified",
        "verificationCode",
        "codeExpiryTime",
      ]);
      const exsistingPhoneNumber = await models.Users.findOne({
        where: {
          telephoneNumber: payload.telephoneNumber,
          countryCode: payload.countryCode,
        },
      });
      if (exsistingPhoneNumber) {
        throw createError(400, messages.telephoneNumberExists);
      }
      await crudService.update(
        { ...payload, signupStage: constants.SIGNUP_STAGES.SUCCESS },
        user.id,
        messages.userNotFound
      );
      Object.assign(user, payload);
      return res.json({
        status: 200,
        message: messages.updatedModel("User"),
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
