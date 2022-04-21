router.post(
  "/userSecurityQuestion",
  validators.userSecurityQuestions.userSecurityQuestionValidator,
  middlewares.validation.request,
  actions.userSecurityQuestions.post.create
);
router.get(
  "/userSecurityQuestion",
  middlewares.validation.request,
  actions.userSecurityQuestions.get.getSecurityQuestions
);
module.exports = { prefix: "userSecurityQuestion", router };
