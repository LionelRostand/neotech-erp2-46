
import { Employee } from '@/types/employee';

/**
 * Vérifie si un poste doit être considéré comme un poste de manager
 */
export const isEmployeeManager = (position: string): boolean => {
  const managerTitles = [
    'manager',
    'directeur',
    'directrice',
    'responsable',
    'chef',
    'superviseur',
    'gérant',
    'leader',
    'supérieur',
    'coordinateur'
  ];
  
  const positionLower = position.toLowerCase();
  return managerTitles.some(title => positionLower.includes(title));
};

/**
 * Obtenir le nom complet de l'employé
 */
export const getEmployeeFullName = (employee: Employee | undefined | null): string => {
  if (!employee) return '';
  
  const firstName = employee.firstName || '';
  const lastName = employee.lastName || '';
  
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
 * Formatage du numéro de téléphone
 */
export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const numbers = phone.replace(/\D/g, '');
  
  // Format français : XX XX XX XX XX
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Si le numéro n'a pas 10 chiffres, on le renvoie tel quel
  return phone;
};

/**
 * Formatter une date au format local
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Calculer l'âge à partir d'une date de naissance
 */
export const calculateAge = (birthDateString: string | undefined): number | null => {
  if (!birthDateString) return null;
  
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Si le mois de naissance n'est pas encore arrivé ou si c'est le même mois mais le jour n'est pas encore arrivé
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
};
