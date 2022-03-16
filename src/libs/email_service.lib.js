const { SANDGRID_APIKEY, EMAIL_FROM } = process.env;
console.log(SANDGRID_APIKEY);
sgMail.setApiKey(SANDGRID_APIKEY);

async function sendEmail(msg) {
  var sgResp = await sgMail.send(msg).catch((error) => {
    console.error(error.message);
  });
  console.log(sgResp);
}
exports.sendVerificationCode = async function (user, verificationCode) {
  const data = {
    to: user.email,
    from: EMAIL_FROM,
    subject: "verification code",
    html: "Your verification code is " + verificationCode,
  };
  await sendEmail(data);
};
