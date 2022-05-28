module.exports = async (req, res, next) => {
  const {
    body: { email, firstName, lastName },
  } = req;
  try {
    const prevNewsLetterSubscriber = await models.NewsLetterSubscribers.findOne(
      {
        where: {
          email,
        },
      }
    );
    if (prevNewsLetterSubscriber)
      return next(createError(400, messages.emailExists));
    const newsLetter = await models.NewsLetterSubscribers.create({
      email,
      firstName,
      lastName,
    });
    libs.email_service.commingSoonLeads({
      email,
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
