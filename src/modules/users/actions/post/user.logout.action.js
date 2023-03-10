module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    const agent = useragent.parse(req.headers["user-agent"]);
    await models.UserDevices.destroy({
      where: {
        userId: user.id,
        deviceType: agent.os.toString(),
      },
    });
    await models.RefreshTokens.destroy({
      where: {
        modelType: "Users",
        userId: user.id,
      },
    });
    res.json({
      status: 200,
      message: messages.success,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
