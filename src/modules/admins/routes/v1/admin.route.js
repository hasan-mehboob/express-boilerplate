router
  .post(
    "/admins/auth/login",
    validators.admins.loginPayloadValidation,
    middlewares.validation.request,
    middlewares.email_format.format,
    middlewares.local_passport.authenticate,
    actions.admins.post.login
  )
  .post(
    "/admins/auth/logout",
    middlewares.validation.request,
    actions.admins.post.logout
  );
module.exports = { prefix: "admins", router };
