exports.post = {
  createUserSecurityQuestion: async (req, res, next) => {
    try {
      const {
        body: { questionId, answer },
      } = req;
      const securityQuestion = await models.SecurityQuestions.findOne({
        where: {
          id: questionId,
        },
      });
      if (!securityQuestion)
        return next(createError(404, messages.notFound("question")));
      const userSecurityQuestion = await models.UserSecurityQuestions.create({
        questionId: questionId,
        answer: utils.hash.makeHashValue(answer),
      });
      return res.json({
        status: 200,
        message: messages.created("userSecurityQuestion"),
        data: userSecurityQuestion,
      });
    } catch (error) {
      next(error);
    }
  },
};
