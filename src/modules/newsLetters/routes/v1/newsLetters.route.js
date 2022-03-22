router.post(
  "/newsLetters/public/create",
  validators.newsLetters.newsLetterValidation,
  middlewares.validation.request,
  actions.newsLetters.createNewsLetter
);
router.get(
  "/newsLetters/public/getAll",
  middlewares.validation.request,
  actions.newsLetters.get.getAllNewsLetters
);
module.exports = { prefix: "newsLetters", router };
