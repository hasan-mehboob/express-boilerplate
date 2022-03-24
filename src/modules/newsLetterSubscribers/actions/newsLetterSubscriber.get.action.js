exports.get = {
  getAllNewsLettersSubscribers: async (req, res, next) => {
    try {
      const NewsLetterSubscribers =
        await models.NewsLetterSubscribers.findAll();
      return res.json({
        status: 200,
        message: messages.success,
        data: NewsLetterSubscribers,
      });
    } catch (error) {
      next(error);
    }
  },
};
