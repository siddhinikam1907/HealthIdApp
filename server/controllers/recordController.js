import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";
import Consent from "../models/Consent.js";
import { uploadBufferToCloudinary } from "../middleware/uploadMiddleware.js";

/* =========================
   UPLOAD RECORD (SECURE)
========================= */
export const uploadRecord = async (req, res) => {
  try {
    const { healthId, recordType, notes } = req.body;

    const patient = await Patient.findOne({ healthId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
    });

    // 🔥 ACCESS CHECK ADDED
    if (!consent || consent.accessEnd < Date.now()) {
      return res.status(403).json({ message: "Access denied or expired" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const uploadResult = await uploadBufferToCloudinary(
      req.file.buffer,
      "healthid/records",
    );

    const record = await MedicalRecord.create({
      patient: patient._id,
      hospital: req.hospital._id,
      recordType,
      fileUrl: uploadResult.secure_url,
      notes,
    });

    res.status(201).json({
      message: "Record uploaded",
      record,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

/* =========================
   GET RECORDS (SECURE)
========================= */
export const getPatientRecords = async (req, res) => {
  try {
    const { healthId } = req.params;

    if (!healthId) {
      return res.status(400).json({ message: "healthId required" });
    }

    const patient = await Patient.findOne({
      healthId: healthId.trim(),
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
    });

    if (!consent || !consent.accessEnd) {
      return res.status(403).json({ message: "No consent found" });
    }

    if (new Date(consent.accessEnd) < new Date()) {
      return res.status(403).json({ message: "Access expired" });
    }

    const records = await MedicalRecord.find({
      patient: patient._id,
    }).populate("hospital", "hospitalName");

    return res.json({
      accessRemainingMinutes: Math.max(
        0,
        Math.floor((consent.accessEnd - Date.now()) / 60000),
      ),
      records,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};
