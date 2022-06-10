const { SENDGRID_APIKEY, EMAIL_FROM } = process.env;

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
    subject: "Pre-Subscribe Confirmed",
    html: `
    Welcome on board!<br><br>
    We are building something great for your one-stop solution to preserving your digital legacy and you’ll be the first ones to know when we roll out.
    <br><br>
<br>
<br>
Thanks,
<br><br>

Your Legacy Suite team
        `,
  }),
};
