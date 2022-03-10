const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.sendVerificationCode = async function (user) {
  const twilioResp = await client.messages
    .create({
      body: "Your verification code is " + user.verificationCode,
      from: "+13196006402",
      to: "+923104212341", // user.phoneNumber
    })
    .catch((error) => {
      console.error(error.message);
    });
  console.log(twilioResp);
};
