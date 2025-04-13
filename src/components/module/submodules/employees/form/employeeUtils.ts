
// This file doesn't exist in the provided files. We'll need to create it or modify the existing src/components/module/submodules/employees/form/employeeFormSchema.ts

import { Employee, EmployeeAddress } from '@/types/employee';
import { EmployeeFormValues } from './employeeFormSchema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Prépare les données d'un employé à partir des valeurs du formulaire
 */
export const prepareEmployeeData = (data: EmployeeFormValues, employeeId: string): Partial<Employee> => {
  // Construire l'adresse à partir des champs individuels
  const address: EmployeeAddress = {
    street: `${data.streetNumber || ''} ${data.streetName || ''}`.trim(),
    city: data.city || '',
    postalCode: data.zipCode || '',
    country: 'France', // Par défaut à France
  };
  
  // Préparer les métadonnées de la photo si disponible
  const photoData = data.photo?.data;
  const photoMeta = data.photo ? {
    fileName: data.photo.fileName || 'profile.jpg',
    fileType: data.photo.fileType || 'image/jpeg',
    fileSize: data.photo.fileSize || 0,
    updatedAt: data.photo.updatedAt || new Date().toISOString()
  } : undefined;
  
  // Convertir le statut en une valeur acceptée par le type Employee
  let status: 'active' | 'inactive' | 'onLeave' | 'Actif';
  
  // Faire correspondre la valeur du formulaire avec les valeurs acceptées
  switch(data.status) {
    case 'Actif':
      status = 'Actif';
      break;
    case 'active':
      status = 'active';
      break;
    case 'inactive':
      status = 'inactive';
      break;
    case 'En congé':
    case 'onLeave':
      status = 'onLeave';
      break;
    default:
      // Valeur par défaut si la valeur n'est pas reconnue
      status = 'active';
  }
  
  // Vérifier si l'employé est un manager
  const isManager = data.position?.toLowerCase().includes('manager') || 
                   data.position?.toLowerCase().includes('directeur');
  
  // Retourner l'objet employé préparé
  return {
    id: employeeId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || '',
    address,
    department: data.department || '',
    position: data.position || '',
    role: isManager ? 'manager' : 'employee',  // Ajouter explicitement le rôle
    contract: data.contract,
    hireDate: data.hireDate || '',
    birthDate: data.birthDate || '',
    status: status,
    manager: data.manager || '',
    professionalEmail: data.professionalEmail || '',
    company: data.company || '',
    photoData,
    photoMeta,
    isManager,  // Add the isManager flag
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Partial<Employee>; // Cast to Partial<Employee> to resolve TypeScript error
};

/**
 * Extrait les champs d'adresse à partir d'une adresse d'employé
 */
export const extractAddressFields = (address: EmployeeAddress | string | undefined) => {
  // Valeurs par défaut
  let streetNumber = '';
  let streetName = '';
  let city = '';
  let zipCode = '';
  let region = '';
  
  // Si l'adresse est une chaîne (ancien format), tenter de l'analyser
  if (typeof address === 'string') {
    return { streetNumber, streetName, city, zipCode, region };
  }
  
  // Si l'adresse est un objet (nouveau format)
  if (address && typeof address === 'object') {
    // Extraire le numéro et le nom de rue de la propriété street
    if (address.street) {
      const streetParts = address.street.split(' ');
      if (streetParts.length > 0) {
        // Le premier élément pourrait être le numéro
        const potentialNumber = streetParts[0];
        if (/^\d+$/.test(potentialNumber)) {
          streetNumber = potentialNumber;
          streetName = streetParts.slice(1).join(' ');
        } else {
          streetName = address.street;
        }
      }
    }
    
    // Extraire les autres champs directement
    city = address.city || '';
    zipCode = address.postalCode || '';
    region = address.state || '';
  }
  
  return { streetNumber, streetName, city, zipCode, region };
};

/**
 * Génère un ID unique pour un employé
 */
export const generateUniqueEmployeeId = (): string => {
  // Utiliser UUID pour générer un ID unique
  const uniqueId = uuidv4();
  // Prendre les 8 premiers caractères pour un ID plus court
  return `EMP-${uniqueId.substring(0, 8)}`.toUpperCase();
};

/**
 * Vérifie si un ID d'employé est au format valide
 */
export const isValidEmployeeId = (id: string): boolean => {
  // Vérifier que l'ID suit le format "EMP-XXXXXXXX"
  return /^EMP-[A-Z0-9]{8}$/.test(id);
};
