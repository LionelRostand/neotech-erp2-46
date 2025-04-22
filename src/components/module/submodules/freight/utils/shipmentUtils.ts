
// Utility function to generate shipment reference
export const generateShipmentReference = (): string => {
  // Format: EXP-{YEAR}-{4 random digits}
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${year}-${randomPart}`;
};
