import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";

export const generateOTP = async (patientId) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OTP.create({
    patient: patientId,
    otp: otp,
    expiresAt: expires,
  });

  console.log("OTP for testing:", otp); // later replace with email/SMS

  return otp;
};
