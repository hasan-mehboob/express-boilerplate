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
    const accessTokenExpiry = dataConstraint.IS_VALID_NUMBER_REGEX.test(
      auth.accessToken.expiry
    )
      ? parseInt(auth.accessToken.expiry) / 60
      : parseInt(auth.accessToken.expiry);
    const { accessToken, refreshToken } = await models[
      user?.tableName
    ].getjwtToken({ user });
    return res.json({
      status: 200,
      message: messages.success,
      data: {
        accessToken,
        ...(Date.now() <= decoded.exp * 1000 &&
        timeDiff > 0 &&
        timeDiff <= accessTokenExpiry
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
