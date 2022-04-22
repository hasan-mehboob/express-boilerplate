module.exports = async (req, res, next) => {
  try {
    const {
      body: { questionId, answer },
      user,
    } = req;

    const securityQuestion = await models.SecurityQuestions.findOne({
      where: {
        id: questionId,
      },
    });
    if (!securityQuestion)
      return next(createError(404, messages.notFound("question")));
    const prevUserSecurityQues = await models.UserSecurityQuestions.findOne({
      where: {
        userId: user.id,
        questionId: questionId,
      },
    });
    if (prevUserSecurityQues)
      return next(createError(400, messages.alreadyExist("question")));
    const { hash, salt } = utils.hash.makeHashValue(answer);
    const userSecurityQuestion = await models.UserSecurityQuestions.create({
      questionId: questionId,
      userId: user.id,
      answer: hash,
      salt,
    });
    return res.json({
      status: 200,
      message: messages.created("userSecurityQuestion"),
      data: userSecurityQuestion,
    });
  } catch (error) {
    next(error);
  }
};
