const crudService = new services.CrudService(models.Users);
const authService = new services.AuthService(models.Users);

exports.update = {
  updateUser: async (req, res, next) => {
    try {
      const { body: payload, user } = req;
      if (
        payload.telephoneNumber &&
        payload.telephoneNumber !== user.telephoneNumber
      ) {
        await authService.verification({ isEmail: false, user, crudService });
        Object.assign(payload, {
          isVerified: {
            email: user?.email,
            telephoneNumber: false,
          },
        });
      } else if (payload.email && payload.email !== user.email) {
        await authService.verification({ isEmail: true, user, crudService });
        Object.assign(payload, {
          isVerified: {
            email: false,
            telephoneNumber: user?.telephoneNumber,
          },
        });
      }
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
};
