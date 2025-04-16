
export interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  statusText: string;
  company?: string; // Ajout de l'entreprise
  badgeNumber?: string; // ID court pour l'employé
}

export const generateBadgeNumber = (): string => {
  // Générer un ID court et mémorisable (4 chiffres)
  return `B-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Niveaux d'accès réduits
export const accessLevels = [
  'Niveau 1 - Standard',
  'Niveau 2 - Restreint', 
  'Niveau 3 - Administration',
  'Niveau 4 - Direction'
];
