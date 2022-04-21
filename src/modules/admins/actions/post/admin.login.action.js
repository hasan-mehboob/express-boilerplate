module.exports = async (req, res, next) => {
  try {
    const { user: admin } = req;
    const token = utils.token.getJWTToken(admin, "admins");
    req.user.dataValues.accessToken = token;
    return res.json({
      status: 200,
      message: messages.signedIn,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
