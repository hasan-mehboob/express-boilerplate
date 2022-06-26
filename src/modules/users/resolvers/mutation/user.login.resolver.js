const { USER_ROLE } = constants;
module.exports = middlewares.graphql(
  middlewares.localPassport.authenticate,
  async (_, args, { req }) => {
    let { user } = req;
    const { rememberMe, as: loginAs } = args;
    user = await models[loginAs].findByPk(user.id);
    const { accessToken, refreshToken } = models[loginAs].getjwtToken({
      user,
      rememberMe,
    });
    helpers.refreshTokens.createOrUpdateRefreshToken({
      user,
      modelType: loginAs,
      refreshToken,
    });
    user.dataValues.accessToken = accessToken;
    user.dataValues.refreshToken = refreshToken;
    if (loginAs === USER_ROLE.USER) {
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
    }
    return user;
  }
);
