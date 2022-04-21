router.post(
  "/newsLetterSubscribers/public/create",
  validators.newsLetterSubscribers.newsLetterValidation,
  middlewares.validation.request,
  actions.newsLetterSubscribers.post.create
);
router.get(
  "/newsLetterSubscribers/public/getAll",
  middlewares.validation.request,
  actions.newsLetterSubscribers.get.getAll
);
module.exports = { prefix: "newsLetterSubscribers", router };
