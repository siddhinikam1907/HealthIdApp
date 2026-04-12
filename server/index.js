import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import consentRoutes from "./routes/consentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
dotenv.config();

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================================================
   CORS FIX
====================================================== */
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use("/api/patient", patientRoutes);

app.use("/api/hospital", hospitalRoutes);

app.use("/api/consent", consentRoutes);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("⏳ Connecting MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
