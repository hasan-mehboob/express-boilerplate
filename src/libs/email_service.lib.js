const { SENDGRID_APIKEY } = process.env;
sgMail.setApiKey(SENDGRID_APIKEY);

async function sendEmail(msg) {
  await sgMail.send(msg).catch((error) => {
    console.error(error.message);
  });
}
exports.sendVerificationCode = async function (user, verificationCode) {
  await sendEmail(
    emailConstraints.verificationCode({ user, verificationCode })
  );
};
exports.commingSoonLeads = async function (user) {
  await sendEmail(emailConstraints.commingSoonLeads({ user }));
};
