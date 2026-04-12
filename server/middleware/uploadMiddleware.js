import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ======================================================
   CLOUDINARY STORAGE CONFIG
====================================================== */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "healthid", // folder in cloudinary

    allowed_formats: ["jpg", "png", "jpeg", "pdf"],

    resource_type: "auto", // VERY IMPORTANT for pdf + images

    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname;
    },
  },
});

/* ======================================================
   MULTER INSTANCE
====================================================== */
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
