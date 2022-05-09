module.exports = async (req, res, next) => {
  try {
    let {
      user,
      body: { remember_me },
    } = req;
    user = await models.Users.findByPk(user.id);
    const { accessToken, refreshToken } = models.Users.getjwtToken({
      user,
      remember_me,
    });
    const userRefreshToken = await models.RefreshTokens.findOne({
      where: {
        userId: user.id,
        modelType: "Users",
      },
    });
    const { hash, salt } = utils.hash.makeHashValue(refreshToken);
    if (!userRefreshToken)
      await models.RefreshTokens.create({
        userId: user.id,
        modelType: "Users",
        token: hash,
        salt,
      });
    else
      await models.RefreshTokens.update(
        {
          token: hash,
          salt,
        },
        {
          where: {
            userId: user.id,
            modelType: "Users",
          },
        }
      );
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
