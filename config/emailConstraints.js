const {
  EMAIL_FROM,
  DEFAULT_ADMIN_EMAIL,
  SENDGRID_TEMPLATE_ID: templateId,
} = process.env;

module.exports = {
  verificationCode: ({ user, verificationCode }) => ({
    to: user.email,
    from: EMAIL_FROM,
    subject: "verification code",
    html: "Your verification code is " + verificationCode,
  }),
  commingSoonLeads: ({ user }) => ({
    to: user.email,
    from: EMAIL_FROM,
    bcc: [DEFAULT_ADMIN_EMAIL],
    templateId,
  }),
};
