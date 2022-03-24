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
    subject: "Subscribe",
    html: `
    Thanks for Subscribing!<br><br>
    We will let you know when app is ready <br><br>

<br>
<br>
Thanks,
<br><br>

Your Legacy Suite team
        `,
  }),
};
