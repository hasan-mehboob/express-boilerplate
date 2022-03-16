const { SENDGRID_APIKEY, EMAIL_FROM } = process.env;

sgMail.setApiKey(SENDGRID_APIKEY);

async function sendEmail(data) {
  const msg = {
    from: data.from,
    to: data.to,
    subject: data.subject,
    html: data.body,
  };
  var sgResp = await sgMail.send(msg).catch((error) => {
    console.error(error.message);
  });
  console.log(sgResp);
}
exports.sendVerificationCode = async function (user, verificationCode) {
  const data = {
    to: user.email,
    from: EMAIL_FROM,
    subject: "Subject",
    text: "verification code",
    html: "Your verification code is " + verificationCode,
  };
  await sendEmail(data);
};
