router
  .post(
    "/users/auth/signUp",
    validators.users.signUpPayloadValidation,
    middlewares.validation.request,
    actions.users.auth.signUp
  )
  .get(
    "/users/auth/login",
    validators.users.signInPayloadValidation,
    middlewares.validation.request,
    middlewares.local_passport.authenticate,
    actions.users.auth.signIn
  )
  .patch(
    "/users/update",
    validators.users.updatePayloadValidation,
    middlewares.validation.request,
    actions.users.update.updateUser
  )
  .get(
    "/users/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  )
  .get(
    "/users/auth/google/callback",
    passport.authenticate("google", { session: false }),
    actions.users.auth.googleCb
  )
  .get(
    "/users/auth/facebook",
    passport.authorize("facebook", { scope: ["email"] })
  )
  .get(
    "/users/auth/facebook/callback",
    passport.authenticate("facebook", { session: false }),
    actions.users.auth.facebookCb
  )
  .post(
    "/users/auth/verify-code/:id",
    validators.users.verifyCodePayloadValidation,
    middlewares.validation.request,
    actions.users.auth.verifyCode
  )
  .post(
    "/users/auth/resend-code/:id",
    validators.users.resendCodePayloadValidation,
    middlewares.validation.request,
    actions.users.auth.resendCode
  )
  .patch(
    "/users/auth/forgot-password",
    validators.users.forgotPasswordPayloadValidation,
    middlewares.validation.request,
    actions.users.auth.forgotPassword
  )
  .patch(
    "/users/auth/verify-account",
    validators.users.forgotPasswordPayloadValidation,
    middlewares.validation.request,
    actions.users.auth.forgotPassword
  )
  .patch(
    "/users/auth/reset-password/:id",
    validators.users.resetPasswordPayload,
    middlewares.validation.request,
    actions.users.auth.resetPassword
  );

module.exports = { prefix: "users", router };
