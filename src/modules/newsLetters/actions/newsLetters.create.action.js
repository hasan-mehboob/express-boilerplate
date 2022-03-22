exports.createNewsLetter = async (req, res, next) => {
  const { body: payload } = req;
  try {
    const prevNewsLetter = await models.NewsLetters.findOne({
      where: {
        email: payload.email,
      },
    });
    if (prevNewsLetter) next(createError(messages.emailExists));
    const newsLetter = await models.NewsLetters.create({
      email: payload.email,
    });
    // FIXME: change comming soom lead
    libs.email_service.commingSoonLeads({
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
