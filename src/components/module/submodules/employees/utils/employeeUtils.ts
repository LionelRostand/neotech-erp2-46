
import { Employee } from '@/types/employee';

/**
 * Vérifie si un employé est un manager basé sur son poste ou le flag isManager
 */
export const isEmployeeManager = (position?: string): boolean => {
  if (!position) return false;
  
  const managerKeywords = [
    'manager', 
    'directeur', 
    'directrice', 
    'responsable', 
    'chef',
    'superviseur',
    'lead',
    'pdg',
    'président',
    'p.d.g'
  ];
  
  const lowerPosition = position.toLowerCase();
  
  return managerKeywords.some(keyword => lowerPosition.includes(keyword));
};

/**
 * Récupère le nom complet d'un employé
 */
export const getEmployeeFullName = (employee?: Employee): string => {
  if (!employee) return 'Employé inconnu';
  return `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employé sans nom';
};

/**
 * Formatter le statut d'un employé pour l'affichage
 */
export const getStatusDisplay = (status?: string): string => {
  if (!status) return 'Inconnu';
  
  switch(status.toLowerCase()) {
    case 'active':
    case 'actif':
      return 'Actif';
    case 'inactive':
    case 'inactif':
      return 'Inactif';
    case 'onleave':
    case 'en congé':
      return 'En congé';
    case 'suspended':
    case 'suspendu':
      return 'Suspendu';
    default:
      return status;
  }
};

/**
 * Formatter le type de contrat d'un employé pour l'affichage
 */
export const getContractTypeDisplay = (contractType?: string): string => {
  if (!contractType) return 'Non spécifié';
  
  switch(contractType.toLowerCase()) {
    case 'cdi':
      return 'CDI';
    case 'cdd':
      return 'CDD';
    case 'stage':
      return 'Stage';
    case 'alternance':
      return 'Alternance';
    case 'freelance':
      return 'Freelance';
    case 'autre':
      return 'Autre';
    default:
      return contractType;
  }
};

/**
 * Récupère l'URL de la photo d'un employé
 */
export const getEmployeePhotoUrl = (employee?: Employee): string => {
  if (!employee) return '';
  return employee.photoURL || employee.photo || '';
};

/**
 * Format a phone number for display
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  
  // Return as is if not matching expected format
  return phone;
};

/**
 * Format a date string for display
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Calculate age from birthdate
 */
export const calculateAge = (birthDate?: string): number | null => {
  if (!birthDate) return null;
  
  try {
    const dob = new Date(birthDate);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
};
