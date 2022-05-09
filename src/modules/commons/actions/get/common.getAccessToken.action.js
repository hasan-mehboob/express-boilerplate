module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    const refreshTokenData = await models.RefreshTokens.findOne({
      where: {
        userId: user.id,
        modelType: user?.tableName,
      },
    });
    if (!refreshTokenData)
      return next(createError(404, messages.notFound("Refresh Token")));
    let decoded = jwtDecode(user.refreshToken);
    const timeDiff = moment(decoded.exp * 1000).diff(moment(), "minutes");
    const { accessToken, refreshToken } = await models[
      user?.tableName
    ].getjwtToken({ user });
    return res.json({
      status: 200,
      message: messages.success,
      data: {
        accessToken,
        ...(Date.now() <= decoded.exp * 1000 && timeDiff > 0 && timeDiff <= 1
          ? {
              refreshToken,
            }
          : null),
      },
    });
  } catch (error) {
    next(error);
  }
};
