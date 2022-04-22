module.exports = async (req, res, next) => {
  try {
    let {
      body: { questions },
      user: admin,
    } = req;
    questions = questions.map((question) => question.trim());
    const prevQuestions = await models.SecurityQuestions.findAll({
      where: {
        question: {
          [Op.in]: questions,
        },
      },
      attributes: ["id", "question"],
    });
    if (prevQuestions?.length > 0)
      throw createError(403, messages.alreadyExist("question"));
    const payload = questions.map((question) => ({
      question: question.trim(),
      createdBy: admin.id,
    }));
    await models.SecurityQuestions.bulkCreate(payload);
    const securityQuestions = await models.SecurityQuestions.findAll();
    return res.json({
      status: 200,
      message: messages.created("Security Questions"),
      data: securityQuestions,
    });
  } catch (error) {
    next(error);
  }
};
