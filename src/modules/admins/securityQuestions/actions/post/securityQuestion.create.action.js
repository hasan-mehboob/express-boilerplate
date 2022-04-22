const crudService = new services.CrudService(models.Users);
module.exports = async (req, res, next) => {
  try {
    const {
      body: { question },
      user,
    } = req;
    const payload = {
      question: question.trim(),
      createdBy: user.id,
    };
    const prevQuestion = await models.SecurityQuestions.findOne({
      where: {
        question: payload.question,
      },
      attributes: ["id", "question"],
    });
    if (prevQuestion) throw createError(403, messages.alreadyExist("question"));
    const securityQuestion = await models.SecurityQuestions.create(payload);
    return res.json({
      status: 200,
      message: messages.created("Security Questions"),
      data: securityQuestion,
    });
  } catch (error) {
    next(error);
  }
};
