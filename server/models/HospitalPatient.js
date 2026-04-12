import mongoose from "mongoose";

const hospitalPatientSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },

    patientName: String,
    phone: String,
    lastVisit: Date,
  },
  { timestamps: true },
);

export default mongoose.model("HospitalPatient", hospitalPatientSchema);
