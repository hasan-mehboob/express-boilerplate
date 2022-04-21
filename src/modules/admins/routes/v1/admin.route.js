router.get(
  "/admins/auth/login",
  validators.admins.loginPayloadValidation,
  middlewares.validation.request,
  middlewares.email_format.format,
  middlewares.local_passport.authenticate,
  actions.admins.get.signin
);
module.exports = { prefix: "admins", router };
