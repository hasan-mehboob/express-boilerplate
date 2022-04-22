module.exports = async (req, res, next) => {
  try {
    let { user } = req;
    user = await models.Users.findByPk(user.id);
    const token = utils.token.getJWTToken(user, "users");
    user.dataValues.accessToken = token;
    const userDevice = await helpers.userDevices.get(req);
    if (!userDevice) helpers.userDevices.create({ ...req, user });
    else helpers.userDevices.update({ ...req, user });
    return res.json({
      status: 200,
      message: messages.signedIn,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
