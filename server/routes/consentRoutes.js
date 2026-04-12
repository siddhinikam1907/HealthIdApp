import express from "express";
import {
  requestConsent,
  verifyConsentOTP,
} from "../controllers/consentController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

/* ======================================================
   1️⃣ Hospital requests access → Send OTP to patient
   POST /api/consent/request
====================================================== */
router.post("/request", hospitalAuth, requestConsent);

/* ======================================================
   2️⃣ Hospital verifies OTP → Access granted
   POST /api/consent/verify
====================================================== */
router.post("/verify", hospitalAuth, verifyConsentOTP);

export default router;
