module.exports = async (req, res, next) => {
  try {
    let {
      user,
      body: { rememberMe },
    } = req;
    user = await models.Users.findByPk(user.id);
    const { accessToken, refreshToken } = models.Users.getjwtToken({
      user,
      rememberMe,
    });
    helpers.refreshTokens.createOrUpdateRefreshToken({
      user,
      modelType: "Users",
      refreshToken,
    });
    user.dataValues.accessToken = accessToken;
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
    utils.cookie.setCookies({
      res,
      cookies: [
        {
          cookieName: "refreshToken",
          value: refreshToken,
        },
      ],
    });
    return res.json({
      status: 200,
      message: messages.signedIn,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
