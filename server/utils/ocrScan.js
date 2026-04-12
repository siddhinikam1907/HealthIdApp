import fs from "fs";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

/* ======================================================
   EXTRACT TEXT FROM PDF (PRIMARY METHOD)
====================================================== */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    if (pdfData.text && pdfData.text.trim().length > 0) {
      return pdfData.text;
    }

    // If PDF has no selectable text (scanned document)
    return await extractTextFromScannedPDF(filePath);
  } catch (error) {
    console.log("PDF extraction error:", error.message);
    return "";
  }
};

/* ======================================================
   OCR FOR SCANNED PDFs (IMAGE-BASED PDF FALLBACK)
====================================================== */
const extractTextFromScannedPDF = async (filePath) => {
  try {
    // Convert first page or whole file buffer to OCR
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m), // optional progress logs
    });

    return result.data.text || "";
  } catch (error) {
    console.log("OCR extraction error:", error.message);
    return "";
  }
};

/* ======================================================
   OPTIONAL: GENERIC IMAGE OCR FUNCTION (FOR LICENSE IMAGES)
====================================================== */
export const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    });

    return result.data.text || "";
  } catch (error) {
    console.log("Image OCR error:", error.message);
    return "";
  }
};
