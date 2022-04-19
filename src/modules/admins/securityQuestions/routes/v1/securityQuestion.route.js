router
  .post(
    "/security-question/admins/",
    validators.securityQuestions.securityQuestionPayloadValidation,
    middlewares.validation.request,
    actions.securityQuestions.post.create
  )
  .post(
    "/security-question/admins/bulk-create/",
    validators.securityQuestions.securityQuestionBulkPayloadValidation,
    middlewares.validation.request,
    actions.securityQuestions.post.bulkCreate
  )
  .get(
    "/security-question/public/",
    actions.securityQuestions.get.getQuestions
  );
module.exports = { prefix: "security-question", router };
