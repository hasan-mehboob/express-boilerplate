module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    await models.RefreshTokens.destroy({
      where: {
        modelType: "Admins",
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
