router.post(
  "/newsLetterSubscribers/public/create",
  validators.newsLetterSubscribers.newsLetterValidation,
  middlewares.validation.request,
  actions.newsLetterSubscribers.createNewsLetterSubscriber
);
router.get(
  "/newsLetterSubscribers/public/getAll",
  middlewares.validation.request,
  actions.newsLetterSubscribers.get.getAllNewsLettersSubscribers
);
module.exports = { prefix: "newsLetterSubscribers", router };
