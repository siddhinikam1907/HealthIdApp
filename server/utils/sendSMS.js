import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendSMS = async (to, message) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to, // must include country code eg +91
    });

    console.log("SMS sent:", sms.sid);
    return true;
  } catch (error) {
    console.error("SMS Error:", error.message);
    return false;
  }
};
