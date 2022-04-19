router.post(
  "/userSecurityQuestion",
  validators.userSecurityQuestions.userSecurityQuestionValidator,
  middlewares.validation.request,
  actions.userSecurityQuestions.post.createUserSecurityQuestion
);
module.exports = { prefix: "userSecurityQuestion", router };
