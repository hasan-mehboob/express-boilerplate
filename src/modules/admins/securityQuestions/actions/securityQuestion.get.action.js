exports.get = {
  getQuestions: async (req, res, next) => {
    try {
      const questions = await models.SecurityQuestions.findAll();
      return res.json({
        status: 200,
        message: messages.success,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  },
};
