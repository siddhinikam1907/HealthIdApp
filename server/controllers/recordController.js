import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";
import Consent from "../models/Consent.js";

/* ======================================================
   UPLOAD MEDICAL RECORD (SECURED)
====================================================== */
export const uploadRecord = async (req, res) => {
  try {
    const { healthId, recordType } = req.body;

    const patient = await Patient.findOne({ healthId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🔐 CONSENT CHECK
    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
    });

    if (!consent) {
      return res.status(403).json({
        message: "Patient consent required",
      });
    }

    const fileUrl = req.file.path;

    const record = await MedicalRecord.create({
      patient: patient._id,
      hospital: req.hospital._id,
      recordType,
      fileUrl,
    });

    res.status(201).json({
      message: "Medical record uploaded",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ======================================================
   GET PATIENT RECORDS (SECURED)
====================================================== */
export const getPatientRecords = async (req, res) => {
  try {
    const { healthId } = req.params;

    const patient = await Patient.findOne({ healthId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🔐 CONSENT CHECK
    const consent = await Consent.findOne({
      patientId: patient._id,
      hospitalId: req.hospital._id,
      status: "approved",
    });

    if (!consent) {
      return res.status(403).json({
        message: "Patient consent required",
      });
    }

    const records = await MedicalRecord.find({
      patient: patient._id,
    }).populate("hospital", "hospitalName email");

    res.status(200).json({
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching records failed" });
  }
};
