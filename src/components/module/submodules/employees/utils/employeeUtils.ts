
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Génère les initiales à partir du nom et prénom d'un employé
 * @param firstName Prénom de l'employé
 * @param lastName Nom de l'employé
 * @returns Initiales (2 caractères maximum)
 */
export const getEmployeeInitials = (firstName: string = '', lastName: string = ''): string => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  } else if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }
  return 'NN'; // Non Nommé
};

/**
 * Génère un nom d'affichage formaté pour un employé
 * @param firstName Prénom de l'employé
 * @param lastName Nom de l'employé
 * @returns Nom formaté (Prénom Nom)
 */
export const getEmployeeDisplayName = (firstName: string = '', lastName: string = ''): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  return 'Employé sans nom';
};

/**
 * Détermine la couleur d'avatar basée sur la première lettre du nom
 * @param name Nom complet ou partiel de l'employé
 * @returns Classe CSS de couleur pour l'avatar
 */
export const getAvatarColorFromName = (name: string = ''): string => {
  if (!name) return 'bg-slate-200 text-slate-700';
  
  const initial = name.charAt(0).toLowerCase();
  const colors: Record<string, string> = {
    'a': 'bg-red-200 text-red-700',
    'b': 'bg-orange-200 text-orange-700',
    'c': 'bg-amber-200 text-amber-700',
    'd': 'bg-yellow-200 text-yellow-700',
    'e': 'bg-lime-200 text-lime-700',
    'f': 'bg-green-200 text-green-700',
    'g': 'bg-emerald-200 text-emerald-700',
    'h': 'bg-teal-200 text-teal-700',
    'i': 'bg-cyan-200 text-cyan-700',
    'j': 'bg-sky-200 text-sky-700',
    'k': 'bg-blue-200 text-blue-700',
    'l': 'bg-indigo-200 text-indigo-700',
    'm': 'bg-violet-200 text-violet-700',
    'n': 'bg-purple-200 text-purple-700',
    'o': 'bg-fuchsia-200 text-fuchsia-700',
    'p': 'bg-pink-200 text-pink-700',
    'q': 'bg-rose-200 text-rose-700',
    'r': 'bg-red-200 text-red-700',
    's': 'bg-orange-200 text-orange-700',
    't': 'bg-amber-200 text-amber-700',
    'u': 'bg-yellow-200 text-yellow-700',
    'v': 'bg-lime-200 text-lime-700',
    'w': 'bg-green-200 text-green-700',
    'x': 'bg-emerald-200 text-emerald-700',
    'y': 'bg-teal-200 text-teal-700',
    'z': 'bg-cyan-200 text-cyan-700',
  };
  
  return colors[initial] || 'bg-slate-200 text-slate-700';
};

/**
 * Détermine la couleur de fond basée sur le poste/fonction
 * @param position Poste ou fonction de l'employé
 * @returns Classes CSS pour la stylisation basée sur le poste
 */
export const getPositionStyleClasses = (position: string = ''): string => {
  const lowerPosition = position.toLowerCase();
  
  if (lowerPosition.includes('directeur') || lowerPosition.includes('directrice') || 
      lowerPosition.includes('pdg') || lowerPosition.includes('président')) {
    return 'bg-purple-100 border-purple-300 shadow-purple-100';
  }
  
  if (lowerPosition.includes('manager') || lowerPosition.includes('chef') || 
      lowerPosition.includes('responsable')) {
    return 'bg-blue-50 border-blue-200 shadow-blue-100';
  }
  
  if (lowerPosition.includes('senior') || lowerPosition.includes('principal')) {
    return 'bg-emerald-50 border-emerald-200 shadow-emerald-100';
  }
  
  return 'bg-white border-slate-200 shadow-slate-100';
};

/**
 * Détermine si un employé a un rôle de manager basé sur son titre/position
 * @param position Poste ou fonction de l'employé
 * @returns true si l'employé est considéré comme un manager
 */
export const isEmployeeManager = (position: string = ''): boolean => {
  if (!position) return false;
  
  const lowerPosition = position.toLowerCase();
  return lowerPosition.includes('manager') || 
         lowerPosition.includes('responsable') || 
         lowerPosition.includes('directeur') || 
         lowerPosition.includes('directrice') ||
         lowerPosition.includes('pdg') ||
         lowerPosition.includes('président') ||
         lowerPosition.includes('ceo') || 
         lowerPosition.includes('chief') ||
         lowerPosition.includes('chef');
};

/**
 * Vérifie si un employé existe déjà dans la collection
 * @param employees Liste des employés existants
 * @param newEmployee Nouvel employé à vérifier
 * @returns true si l'employé existe déjà
 */
export const employeeExists = (employees: any[], newEmployee: any): boolean => {
  if (!employees || !newEmployee) return false;
  
  // Vérifier si l'employé existe déjà avec le même email
  return employees.some(emp => 
    emp.email?.toLowerCase() === newEmployee.email?.toLowerCase() ||
    emp.professionalEmail?.toLowerCase() === newEmployee.professionalEmail?.toLowerCase() ||
    (emp.firstName?.toLowerCase() === newEmployee.firstName?.toLowerCase() && 
     emp.lastName?.toLowerCase() === newEmployee.lastName?.toLowerCase())
  );
};

/**
 * Traite les métadonnées de photo et renvoie l'URL de la photo
 * @param photoMeta Métadonnées de la photo
 * @returns URL de la photo ou chaîne vide
 */
export const processPhotoMetadata = (photoMeta: EmployeePhotoMeta | string | undefined): string => {
  if (!photoMeta) return '';
  
  // Si photoMeta est un objet avec une propriété 'data', utiliser cette valeur
  if (typeof photoMeta === 'object' && photoMeta !== null && 'data' in photoMeta) {
    return photoMeta.data as string;
  }
  
  // Si photoMeta est une chaîne directement, la retourner
  if (typeof photoMeta === 'string') {
    return photoMeta;
  }
  
  return '';
};
