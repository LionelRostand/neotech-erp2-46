
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  status: string;
  statusText: string;
  company?: string;  // Nouveau champ pour l'entreprise
}

export const generateBadgeNumber = (): string => {
  // Format: BAD-YYMMDD-XXXX où XXXX est un nombre aléatoire entre 1000 et 9999
  const now = new Date();
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `BAD-${year}${month}${day}-${random}`;
};
