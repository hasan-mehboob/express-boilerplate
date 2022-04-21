const crudService = new services.CrudService(models.Users);
const authService = new services.AuthService(models.Users);

module.exports = async (req, res, next) => {
  try {
    let { body: payload, user } = req;
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
    const userData = await crudService.update(
      { ...payload },
      user.id,
      messages.userNotFound
    );
    return res.json({
      status: 200,
      message: messages.updatedModel("User"),
      data: userData,
    });
  } catch (err) {
    next(err);
  }
};
