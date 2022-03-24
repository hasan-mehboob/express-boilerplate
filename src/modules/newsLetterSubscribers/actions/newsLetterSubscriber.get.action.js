exports.get = {
  getAllNewsLettersSubscribers: async (req, res, next) => {
    try {
      const NewsLetterSubscribers =
        await models.NewsLetterSubscribers.findAll();
      return res.json({
        status: 200,
        message: messages.getAllModel("NewsLetterSubscribers"),
        data: NewsLetterSubscribers,
      });
    } catch (error) {
      next(error);
    }
  },
};
