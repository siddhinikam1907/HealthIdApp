import express from "express";
import {
  getHospitalProfile,
  searchPatientByHealthId,
  addPatientToHospital,
  getHospitalPatients,
  getMyUploadedRecords,
} from "../controllers/hospitalController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

// All routes protected (hospital must be logged in)
router.use(protectHospital);

// Dashboard profile
router.get("/profile", getHospitalProfile);

// Search patient
router.post("/search-patient", searchPatientByHealthId);

// Save patient to hospital
router.post("/add-patient", addPatientToHospital);

// Get hospital patients
router.get("/patients", getHospitalPatients);

// Get uploaded records
router.get("/records", getMyUploadedRecords);

export default router;
