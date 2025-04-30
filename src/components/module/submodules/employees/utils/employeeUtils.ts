
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
