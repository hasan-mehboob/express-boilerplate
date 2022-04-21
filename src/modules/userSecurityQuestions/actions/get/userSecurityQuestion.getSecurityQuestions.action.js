module.exports = async (req, res, next) => {
  try {
    const { user } = req;
    const userSecurityQuestion = await models.UserSecurityQuestions.findAll({
      where: {
        userId: user.id,
      },
      include: {
        model: models.SecurityQuestions,
        required: true,
      },
    });
    res.json({
      status: 200,
      message: messages.success,
      data: userSecurityQuestion,
    });
  } catch (error) {
    next(error);
  }
};
