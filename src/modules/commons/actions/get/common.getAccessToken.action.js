module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    const refreshTokenData = await models.RefreshTokens.findOne({
      where: {
        userId: user.id,
        modelType: user?.tableName,
      },
    });
    let decoded = jwt_decode(refreshTokenData.token);
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
