import Patient from "../models/Patient.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateHealthId from "../utils/generateHealthId.js";
import generateOTP from "../utils/generateOTP.js";
import sendSMS from "../utils/sendSMS.js";
import { extractTextFromPDF } from "../utils/ocrScan.js";
import { validateHospitalData } from "../services/hospitalValidation.service.js";
export const registerPatient = async (req, res) => {
  try {
    const { name, phone, aadhaar } = req.body;

    // check existing patient using phone
    const existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already registered" });
    }

    // generate HealthID
    const healthId = generateHealthId();

    const patient = await Patient.create({
      name,
      phone,
      aadhaar,
      healthId,
    });

    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Patient registration failed" });
  }
};
export const sendPatientOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // generate OTP
    const otp = generateOTP();

    // store temporarily in DB
    patient.loginOTP = otp;
    patient.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    await patient.save();

    // send SMS
    await sendSMS(phone, `Your HealthID login OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP sending failed" });
  }
};
export const verifyPatientOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (patient.loginOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (patient.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP
    patient.loginOTP = null;
    patient.otpExpiry = null;
    await patient.save();

    // create JWT
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      regNumber,
      address,
      email,
      phone,
      password,
      doctors,
    } = req.body;

    const filePath = req.file.path; // multer upload

    const existing = await Hospital.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    // STEP 1: OCR
    const licenseText = await extractTextFromPDF(filePath);

    // STEP 2: VALIDATION ENGINE
    const validation = await validateHospitalData({
      regNumber,
      doctors,
      licenseText,
      email,
    });

    // STEP 3: HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // STEP 4: STATUS DECISION
    const status = validation.autoApprove ? "PENDING" : "REJECTED_AUTO";

    const hospital = await Hospital.create({
      hospitalName,
      regNumber,
      address,
      email,
      phone,
      password: hashedPassword,
      licenseFile: filePath,
      status,
      trustScore: validation.score,
      verificationFlags: validation.flags,
    });

    res.status(201).json({
      message:
        status === "PENDING"
          ? "Submitted for admin approval"
          : "Rejected automatically due to invalid documents",
      hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (hospital.status !== "approved") {
      return res.status(403).json({
        message: "Hospital not verified by admin yet",
      });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: hospital._id, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      hospital,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
