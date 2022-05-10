exports.createOrUpdateRefreshToken = async ({
  user,
  modelType,
  refreshToken,
}) => {
  const userRefreshToken = await models.RefreshTokens.findOne({
    where: {
      userId: user.id,
      modelType: modelType,
    },
  });
  const { hash, salt } = utils.hash.makeHashValue(refreshToken);
  if (!userRefreshToken)
    await models.RefreshTokens.create({
      userId: user.id,
      modelType: modelType,
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
          modelType: modelType,
        },
      }
    );
};
