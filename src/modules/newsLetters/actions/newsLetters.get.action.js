exports.get = {
  getAllNewsLetters: async (req, res, next) => {
    try {
      const newsLetters = await models.NewsLetters.findAll();
      return res.json({
        status: 200,
        message: messages.getAllModel("NewsLetter"),
        data: newsLetters,
      });
    } catch (error) {
      next(error);
    }
  },
};
