module.exports = async (req, res, next) => {
  try {
    const { user: admin } = req;
    const { accessToken, refreshToken } = models.Admins.getjwtToken(admin);
    const prevRefreshToken = await models.RefreshTokens.findOne({
      where: {
        userId: admin.id,
      },
    });
    if (!prevRefreshToken)
      await models.RefreshTokens.create({
        userId: admin.id,
        modelType: "Admins",
        token: refreshToken,
      });
    utils.cookie.setCookies({
      res,
      cookies: [
        {
          cookieName: "accessToken",
          value: accessToken,
        },
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
