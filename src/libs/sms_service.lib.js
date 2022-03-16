const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.sendVerificationCode = async function (user, verificationCode) {
  const twilioResp = await client.messages
    .create({
      body: "Your verification code is " + verificationCode,
      from: "+17579929870",
      // FIXME: change hard coded phoneNumber to user.phoneNumber
      to: `+923074477297`, // user.phoneNumber
      // to: `+${user.countryCode}${user.telephoneNumber}`, // user.phoneNumber
    })
    .catch((error) => {
      console.error(error.message);
    });
  console.log(twilioResp);
};
