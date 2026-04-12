import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  uploadRecord,
  getPatientRecords,
} from "../controllers/medicalRecordController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

/* ======================================================
   1️⃣ Upload Medical Record (Hospital Only)
   POST /api/records/upload
====================================================== */
router.post(
  "/upload",
  hospitalAuth, // hospital must be logged in
  upload.single("file"), // Cloudinary upload middleware
  uploadRecord,
);

/* ======================================================
   2️⃣ Get Patient Records (After OTP Consent)
   GET /api/records/:healthId
====================================================== */
router.get("/:healthId", hospitalAuth, getPatientRecords);

export default router;
