import Patient from "../models/Patient.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Consent from "../models/Consent.js";

/* ======================================================
   GET PROFILE
====================================================== */
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ======================================================
   GET MY RECORDS
====================================================== */
export const getMyRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patient: req.patient._id,
    }).populate("hospital", "hospitalName email");

    res.status(200).json({
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

/* ======================================================
   GET MY CONSENTS
====================================================== */
export const getMyConsents = async (req, res) => {
  try {
    const consents = await Consent.find({
      patientId: req.patient._id,
    }).populate("hospitalId", "hospitalName email");

    res.status(200).json(consents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

/* ======================================================
   GET HEALTH CARD
====================================================== */
export const getHealthCard = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id);

    res.status(200).json({
      name: patient.name,
      healthId: patient.healthId,
      qrCode: patient.qrCode,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch health card" });
  }
};
