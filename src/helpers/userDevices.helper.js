exports.create = async (req) => {
  const agent = useragent.parse(req.headers["user-agent"]);
  return await models.UserDevices.create({
    userId: req.user.id,
    deviceType: agent.os.toString(),
    requestHeaders: JSON.stringify(agent),
    deviceIdentifier: req?.user?.accessToken,
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
  const agent = useragent.parse(req.headers["user-agent"]);
  return await models.UserDevices.update(
    {
      deviceIdentifier: req?.user?.accessToken,
    },
    {
      where: {
        userId: req.user.id,
        deviceType: agent.os.toString(),
      },
    }
  );
};
