
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from './employeeFormSchema';
import { v4 as uuidv4 } from 'uuid';

export const prepareEmployeeData = (data: EmployeeFormValues, existingId?: string): Partial<Employee> => {
  // Construct address object from individual fields
  const addressObj = {
    street: (data.streetNumber ? data.streetNumber + ' ' : '') + (data.streetName || ''),
    city: data.city || '',
    postalCode: data.zipCode || '',
    state: data.region || '',
    country: 'France' // Default country
  };

  // Prepare photo data if available
  const photoData = data.photo ? {
    photoData: data.photo.data,
    photoMeta: {
      fileName: data.photo.fileName,
      fileType: data.photo.fileType,
      fileSize: data.photo.fileSize,
      updatedAt: data.photo.updatedAt
    }
  } : {};

  // Utiliser l'ID existant ou générer un nouvel ID employé unique avec un préfixe
  // Garantir que l'ID est toujours dans le même format EMP#### pour la cohérence
  const employeeId = existingId || `EMP${Math.floor(1000 + Math.random() * 9000)}`;
  
  console.log(`Préparation des données pour l'employé avec l'ID: ${employeeId}`);

  return {
    id: employeeId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: addressObj,
    department: data.department,
    departmentId: data.department,
    position: data.position,
    contract: data.contract,
    hireDate: data.hireDate,
    manager: data.manager || '',
    managerId: '',
    status: data.status as 'active' | 'inactive' | 'onLeave' | 'Actif',
    company: data.company,
    professionalEmail: data.professionalEmail,
    skills: [],
    education: [],
    documents: [],
    workSchedule: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 17:00',
    },
    payslips: [],
    ...photoData,
    // Ajouter des timestamps pour le suivi des modifications
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Fonction d'utilité pour extraire les informations d'adresse individuelles
export const extractAddressFields = (address: string | any): {
  streetNumber: string;
  streetName: string;
  city: string;
  zipCode: string;
  region: string;
} => {
  // Si l'adresse est une chaîne de caractères
  if (typeof address === 'string') {
    // Tenter d'extraire les informations d'une chaîne formatée
    const parts = address.split(',').map(part => part.trim());
    const streetParts = (parts[0] || '').split(' ');
    const streetNumber = streetParts.length > 0 ? streetParts[0] : '';
    const streetName = streetParts.slice(1).join(' ');
    
    return {
      streetNumber,
      streetName,
      city: parts[1] || '',
      zipCode: parts[2] || '',
      region: parts[3] || '',
    };
  }
  
  // Si l'adresse est un objet
  if (typeof address === 'object' && address !== null) {
    const streetParts = (address.street || '').split(' ');
    const streetNumber = streetParts.length > 0 ? streetParts[0] : '';
    const streetName = streetParts.slice(1).join(' ');
    
    return {
      streetNumber,
      streetName,
      city: address.city || '',
      zipCode: address.postalCode || '',
      region: address.state || '',
    };
  }
  
  // Valeur par défaut
  return {
    streetNumber: '',
    streetName: '',
    city: '',
    zipCode: '',
    region: '',
  };
};

// Générer un ID unique pour un nouvel employé
export const generateUniqueEmployeeId = (): string => {
  // Format: EMP + 4 chiffres aléatoires
  return `EMP${Math.floor(1000 + Math.random() * 9000)}`;
};

// Vérifier si l'ID employé est dans le format correct
export const isValidEmployeeId = (id: string): boolean => {
  return /^EMP\d{4}$/.test(id);
};
