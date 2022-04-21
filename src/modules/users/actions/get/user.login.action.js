module.exports = async (req, res, next) => {
  try {
    let { user } = req;
    user = await models.Users.findByPk(user.id);
    const token = utils.token.getJWTToken(user, "users");
    user.dataValues.accessToken = token;
    const agent = useragent.parse(req.headers["user-agent"]);
    const userDevice = await models.UserDevices.findOne({
      where: {
        userId: user.id,
        deviceType: agent.os.toString(),
      },
    });
    if (!userDevice)
      await models.UserDevices.create({
        userId: user.id,
        deviceType: agent.os.toString(),
        requestHeaders: JSON.stringify(agent),
        deviceIdentifier: token,
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
