exports.createNewsLetter = async (req, res, next) => {
  const { body: payload } = req;
  try {
    const newsLetter = await models.NewsLetters.create({
      email: payload.email,
    });
    return res.json({
      status: 200,
      message: messages.created("NewsLetter"),
      data: newsLetter,
    });
  } catch (error) {
    next(error);
  }
};
