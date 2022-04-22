exports.create = async (req) => {
  const token = req?.user?.token || req?.user?.dataValues?.accessToken;
  const agent = useragent.parse(req.headers["user-agent"]);
  return await models.UserDevices.create({
    userId: req.user.id,
    deviceType: agent.os.toString(),
    requestHeaders: JSON.stringify(agent),
    deviceIdentifier: token,
  });
};
exports.get = async (req) => {
  const agent = useragent.parse(req.headers["user-agent"]);
  return await models.UserDevices.findOne({
    where: {
      userId: req.user.id,
      deviceType: agent.os.toString(),
    },
  });
};
exports.update = async (req) => {
  const token = req?.user?.token || req?.user?.dataValues?.accessToken;
  const agent = useragent.parse(req.headers["user-agent"]);
  return await models.UserDevices.update(
    {
      deviceIdentifier: token,
    },
    {
      where: {
        userId: req.user.id,
        deviceType: agent.os.toString(),
      },
    }
  );
};
