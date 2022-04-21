router.post(
  "/userSecurityQuestion",
  validators.userSecurityQuestions.userSecurityQuestionValidator,
  middlewares.validation.request,
  actions.userSecurityQuestions.post.create
);
module.exports = { prefix: "userSecurityQuestion", router };
