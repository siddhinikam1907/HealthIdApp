export const protectAdmin = (req, res, next) => {
  const { email, password } = req.headers;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({ message: "Admin not authorized" });
  }
};
