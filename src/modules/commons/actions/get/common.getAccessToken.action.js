module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    const { accessToken } = await models.Users.getjwtToken({ user });
    utils.cookie.setCookies({
      res,
      cookies: [
        {
          cookieName: "accessToken",
          value: accessToken,
        },
      ],
    });
    return res.json({
      status: 200,
      message: messages.success,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
