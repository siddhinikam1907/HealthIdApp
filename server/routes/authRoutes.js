import express from "express";
import {
  registerPatient,
  sendPatientOTP,
  verifyPatientOTP,
  registerHospital,
  loginHospital,
} from "../controllers/authController.js";

const router = express.Router();

/* ======================================================
   PATIENT AUTH ROUTES
====================================================== */

// Register patient (create HealthID)
router.post("/patient/register", registerPatient);

// Login step 1 → send OTP
router.post("/patient/send-otp", sendPatientOTP);

// Login step 2 → verify OTP
router.post("/patient/verify-otp", verifyPatientOTP);

/* ======================================================
   HOSPITAL AUTH ROUTES
====================================================== */

// Hospital registration (goes to admin approval)
router.post("/hospital/register", registerHospital);

// Hospital login (after admin approval)
router.post("/hospital/login", loginHospital);

export default router;
