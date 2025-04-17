
import { Employee } from '@/types/employee';
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Vérifie si un intitulé de poste correspond à un manager
 * @param position Intitulé du poste à vérifier
 * @returns true si le poste est un poste de manager
 */
export const isEmployeeManager = (position: string): boolean => {
  if (!position) return false;
  
  const lowerPosition = position.toLowerCase();
  
  // Liste des mots-clés indiquant un poste de management
  const managerKeywords = [
    'manager', 'directeur', 'directrice', 'chef', 'responsable',
    'supervisor', 'lead', 'head', 'président', 'ceo', 'cto', 'coo', 'cfo',
    'vp', 'vice-président', 'dirigeant'
  ];
  
  return managerKeywords.some(keyword => lowerPosition.includes(keyword));
};

/**
 * Génère une chaîne formatée avec le nom et prénom
 */
export const getEmployeeFullName = (employee: Partial<Employee>): string => {
  if (!employee) return '';
  return `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
};

/**
 * Convertit une date au format français
 */
export const formatDateFR = (dateStr?: string): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return dateStr;
  }
};
