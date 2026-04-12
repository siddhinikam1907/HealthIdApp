const generateHealthId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MH-${year}-${random}`;
};

export default generateHealthId;
