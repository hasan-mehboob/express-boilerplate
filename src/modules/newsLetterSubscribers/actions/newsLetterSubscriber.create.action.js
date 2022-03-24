exports.createNewsLetterSubscriber = async (req, res, next) => {
  const { body: payload } = req;
  try {
    const prevNewsLetterSubscriber = await models.NewsLetterSubscribers.findOne(
      {
        where: {
          email: payload.email,
        },
      }
    );
    if (prevNewsLetterSubscriber)
      return next(createError(400, messages.emailExists));
    const newsLetter = await models.NewsLetterSubscribers.create({
      email: payload.email,
    });
    libs.email_service.commingSoonLeads({
      email: payload.email,
    });
    return res.json({
      status: 200,
      message: messages.created("NewsLetterSubscribers"),
      data: newsLetter,
    });
  } catch (error) {
    next(error);
  }
};
