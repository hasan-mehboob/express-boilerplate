const { SANDGRID_APIKEY, EMAIL_FROM } = process.env;
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
exports.commingSoonLeads = async function (user) {
  const data = {
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
  };
  await sendEmail(data);
};
