import Hospital from "../models/Hospital.js";

/* ======================================================
   GET ALL HOSPITALS (PENDING / APPROVED / REJECTED)
====================================================== */
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");

    res.status(200).json({
      total: hospitals.length,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};
/* ======================================================
   GET SINGLE HOSPITAL DETAILS
====================================================== */
export const getHospitalDetails = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select("-password");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital" });
  }
};
/* ======================================================
   APPROVE HOSPITAL
====================================================== */
export const approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.status = "approved";
    hospital.verifiedByAdmin = true;

    await hospital.save();

    res.status(200).json({
      message: "Hospital approved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};
/* ======================================================
   REJECT HOSPITAL
====================================================== */
export const rejectHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.status = "rejected";
    hospital.verifiedByAdmin = false;

    await hospital.save();

    res.status(200).json({
      message: "Hospital rejected",
    });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed" });
  }
};
