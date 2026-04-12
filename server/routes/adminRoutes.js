import express from "express";
import {
  getAllHospitals,
  getHospitalDetails,
  approveHospital,
  rejectHospital,
} from "../controllers/adminController.js";

const router = express.Router();

// View all hospitals
router.get("/hospitals", getAllHospitals);

// View single hospital
router.get("/hospital/:id", getHospitalDetails);

// Approve hospital
router.put("/approve/:id", approveHospital);

// Reject hospital
router.put("/reject/:id", rejectHospital);

export default router;
