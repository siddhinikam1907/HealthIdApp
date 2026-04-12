const hospitalRegex = /^[A-Z]{2}-\d{5}-\d{4}$/;
const doctorRegex = /^[A-Z]{2,4}\/\d{4}\/\d{4,6}$/;

export const validateHospitalData = async ({
  regNumber,
  doctors,
  licenseText,
  email,
}) => {
  let score = 0;

  let flags = {
    regValid: false,
    doctorValid: false,
    licenseValid: false,
    emailRisk: false,
  };

  // ---------------- REG NUMBER ----------------
  if (hospitalRegex.test(regNumber)) {
    score += 30;
    flags.regValid = true;
  }

  // ---------------- DOCTORS ----------------
  const doctorValid = doctors?.every((d) => doctorRegex.test(d.licenseNumber));

  if (doctorValid) {
    score += 30;
    flags.doctorValid = true;
  }

  // ---------------- LICENSE OCR ----------------
  const keywords = ["hospital", "license", "registration", "government"];

  const licenseValid = keywords.some((word) =>
    licenseText.toLowerCase().includes(word),
  );

  if (licenseValid) {
    score += 30;
    flags.licenseValid = true;
  }

  // ---------------- EMAIL RISK ----------------
  const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com"];

  if (freeEmailDomains.some((d) => email.includes(d))) {
    score -= 10;
    flags.emailRisk = true;
  }

  return {
    score,
    flags,
    autoApprove: score >= 70,
  };
};
