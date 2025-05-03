import { Employee } from '@/types/employee';

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
 * Génère les initiales d'un employé
 */
export const getEmployeeInitials = (employee: Partial<Employee>): string => {
  if (!employee) return '';
  const firstName = employee.firstName || '';
  const lastName = employee.lastName || '';
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

/**
 * Génère les initiales à partir du prénom et nom
 * @param firstName Prénom
 * @param lastName Nom
 * @returns Initiales (2 caractères maximum)
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName ? firstName.charAt(0) : '';
  const last = lastName ? lastName.charAt(0) : '';
  return (first + last).toUpperCase();
};

/**
 * Génère une couleur d'avatar basée sur le nom
 */
export const getAvatarColorFromName = (name: string): string => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  
  if (!name) return colors[0];
  
  // Simple hash function to get a consistent color for a given name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Génère des classes CSS pour styliser un poste spécifique
 */
export const getPositionStyleClasses = (position: string): string => {
  if (!position) return 'text-gray-600';
  
  const lowerPosition = position.toLowerCase();
  
  if (lowerPosition.includes('manager') || 
      lowerPosition.includes('directeur') || 
      lowerPosition.includes('responsable')) {
    return 'text-blue-600 font-medium';
  }
  
  if (lowerPosition.includes('senior') || lowerPosition.includes('lead')) {
    return 'text-purple-600 font-medium';
  }
  
  return 'text-gray-600';
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
