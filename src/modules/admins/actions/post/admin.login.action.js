module.exports = async (req, res, next) => {
  try {
    const { user: admin } = req;
    const { accessToken, refreshToken } = models.Admins.getjwtToken({
      user: admin,
    });
    req.user.dataValues.accessToken = accessToken;
    helpers.refreshTokens.createOrUpdateRefreshToken({
      user: admin,
      refreshToken,
      modelType: "Admins",
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
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
