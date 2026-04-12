import QRCode from "qrcode";

const generateQR = async (healthId) => {
  const qr = await QRCode.toDataURL(healthId);
  return qr;
};

export default generateQR;
