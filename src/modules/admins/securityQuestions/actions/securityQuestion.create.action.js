const crudService = new services.CrudService(models.Users);

exports.post = {
  create: async (req, res, next) => {
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
      if (prevQuestion) throw createError(403, "Already Exsist");
      const securityQuestion = await models.SecurityQuestions.create(payload);
      return res.json({
        status: 200,
        message: messages.created("Security Questions"),
        data: securityQuestion,
      });
    } catch (error) {
      next(error);
    }
  },
  bulkCreate: async (req, res, next) => {
    try {
      let {
        body: { questions },
        user: admin,
      } = req;
      questions=questions.map(question=>question.trim())
      const prevQuestions = await models.SecurityQuestions.findAll({
        where: {
          question: {
            [Op.in]: questions,
          },
        },
        attributes: ["id", "question"],
      });
      if (prevQuestions?.length > 0) throw createError(403, "Already Exsist");
      const payload = questions.map((question) => ({
        question: question.trim(),
        createdBy: admin.id,
      }));
      const securityQuestions = await models.SecurityQuestions.bulkCreate(
        payload
      );
      return res.json({
        status: 200,
        message: messages.created("Security Questions"),
        data: securityQuestions,
      });
    } catch (error) {
      next(error);
    }
  },
};
