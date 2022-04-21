module.exports = async (req, res, next) => {
  try {
    const newsLetterSubscribers = await models.NewsLetterSubscribers.findAll();
    return res.json({
      status: 200,
      message: messages.success,
      data: newsLetterSubscribers,
    });
  } catch (error) {
    next(error);
  }
};
