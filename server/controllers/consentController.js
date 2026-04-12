import Patient from "../models/Patient.js";
import Consent from "../models/Consent.js";
import generateOTP from "../utils/generateOTP.js";
import sendSMS from "../utils/sendSMS.js";

/* ======================================================
   REQUEST CONSENT (SEND OTP)
====================================================== */
export const requestConsent = async (req, res) => {
  try {
    const { healthId } = req.body;

    const patient = await Patient.findOne({ healthId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const otp = generateOTP();

    const consent = await Consent.create({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      otp,
      status: "pending",
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendSMS(
      patient.phone,
      `HealthID Access Request 🚨
Hospital: ${req.hospital.hospitalName}
OTP: ${otp}
Valid for 5 minutes`,
    );

    res.status(200).json({
      message: "OTP sent successfully",
      consentId: consent._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Consent request failed" });
  }
};

/* ======================================================
   VERIFY OTP (GRANT ACCESS)
====================================================== */
export const verifyConsentOTP = async (req, res) => {
  try {
    const { consentId, otp } = req.body;

    const consent = await Consent.findById(consentId);

    if (!consent) {
      return res.status(404).json({ message: "Consent not found" });
    }

    if (consent.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (consent.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    consent.status = "approved";
    await consent.save();

    res.status(200).json({
      message: "Access granted",
      access: true,
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
