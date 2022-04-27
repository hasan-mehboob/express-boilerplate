router
  .post(
    "/admins/auth/login",
    validators.admins.loginPayloadValidation,
    middlewares.validation.request,
    middlewares.email_format.format,
    middlewares.local_passport.authenticate,
    actions.admins.post.login
  )
  .get("/admins/getAccessToken", actions.commons.get.getAccessToken);

module.exports = { prefix: "admins", router };
