module.exports = async (req, res, next) => {
  try {
    const { user: admin } = req;
    const { accessToken, refreshToken } = models.Admins.getjwtToken({
      user: admin,
    });
    req.user.dataValues.accessToken = accessToken;
    const prevRefreshToken = await models.RefreshTokens.findOne({
      where: {
        userId: admin.id,
        modelType: "Admins",
      },
    });
    if (!prevRefreshToken)
      await models.RefreshTokens.create({
        userId: admin.id,
        modelType: "Admins",
        token: refreshToken,
      });
    else
      await models.RefreshTokens.update(
        {
          token: refreshToken,
        },
        {
          where: {
            userId: admin.id,
            modelType: "Admins",
          },
        }
      );
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
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
