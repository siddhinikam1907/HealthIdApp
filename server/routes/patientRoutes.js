import express from "express";
import {
  getPatientProfile,
  getMyRecords,
  getMyConsents,
  getMyHospitals,
  getHealthCard,
} from "../controllers/patientController.js";

import { protectPatient } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected (patient must be logged in)
router.use(protectPatient);

router.get("/profile", getPatientProfile);
router.get("/records", getMyRecords);
router.get("/consents", getMyConsents);
router.get("/hospitals", getMyHospitals);
router.get("/healthcard", getHealthCard);

export default router;
