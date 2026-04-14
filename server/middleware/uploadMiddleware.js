import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/* ======================================================
   MEMORY STORAGE → used for BOTH flows
====================================================== */
const storage = multer.memoryStorage();

export const memoryUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* ======================================================
   BUFFER → CLOUDINARY UPLOAD FUNCTION
====================================================== */
export const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
