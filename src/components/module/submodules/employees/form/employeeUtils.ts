
import { Employee, EmployeeAddress } from '@/types/employee';
import { EmployeeFormValues } from './employeeFormSchema';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDocRef, getCollectionRef } from '@/hooks/firestore/common-utils';
import { setDocument } from '@/hooks/firestore/update-operations';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';

// Fonction utilitaire pour déterminer si un employé est un responsable
export const determineIfManager = (position: string | undefined): boolean => {
  if (!position) return false;
  
  const lowerPosition = position.toLowerCase();
  return lowerPosition.includes('manager') || 
         lowerPosition.includes('responsable') || 
         lowerPosition.includes('directeur') || 
         lowerPosition.includes('pdg') ||
         lowerPosition.includes('ceo') || 
         lowerPosition.includes('chief');
};

/**
 * Ajoute ou met à jour un employé dans la collection des managers si nécessaire
 * @param employeeData Données de l'employé
 * @returns Promesse qui se résout une fois l'opération terminée
 */
export const syncManagerStatus = async (employeeData: Partial<Employee>): Promise<void> => {
  try {
    if (!employeeData.id) {
      console.error("ID d'employé manquant pour la synchronisation du statut de manager");
      return;
    }
    
    const isManager = determineIfManager(employeeData.position);
    console.log(`Vérification du statut de manager pour ${employeeData.firstName} ${employeeData.lastName}:`, isManager);
    
    // Mettre à jour le champ isManager dans les données
    employeeData.isManager = isManager;
    
    if (isManager) {
      // Ajouter/mettre à jour dans la collection des managers
      console.log(`Ajout/mise à jour de ${employeeData.firstName} ${employeeData.lastName} dans la collection des managers`);
      await setDocument(COLLECTIONS.HR.MANAGERS, employeeData.id, {
        ...employeeData,
        role: 'manager',
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation du statut de manager:", error);
  }
};

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
  
  // Vérifier si l'employé est un manager par son poste ou si forcé par le formulaire
  const isPositionManager = determineIfManager(data.position);
  const isManager = data.forceManager || isPositionManager;
  
  console.log(`Détection de manager pour ${data.firstName} ${data.lastName}:`, { 
    isPositionManager,
    forceManager: data.forceManager,
    finalIsManager: isManager
  });
  
  // Retourner l'objet employé préparé
  const employeeData: Partial<Employee> = {
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
  };
  
  return employeeData;
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

/**
 * Sauvegarde un employé et met à jour son statut de manager si nécessaire
 */
export const saveEmployee = async (employeeData: Partial<Employee>): Promise<Partial<Employee> | null> => {
  try {
    const isNewEmployee = !employeeData.id || !isValidEmployeeId(employeeData.id);
    const employeeId = isNewEmployee ? generateUniqueEmployeeId() : employeeData.id;
    
    // S'assurer que l'ID est défini dans les données
    employeeData.id = employeeId;
    
    // Déterminer si l'employé est un manager
    const isManager = determineIfManager(employeeData.position);
    console.log(`Statut de manager pour ${employeeData.firstName} ${employeeData.lastName}:`, isManager);
    employeeData.isManager = isManager;
    employeeData.role = isManager ? 'manager' : 'employee';
    
    let result;
    
    // Sauvegarder dans la collection principale des employés
    if (isNewEmployee) {
      result = await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData);
      console.log("Nouvel employé créé:", result);
    } else {
      result = await setDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, employeeData);
      console.log("Employé existant mis à jour:", result);
    }
    
    // Synchroniser avec la collection des managers
    await syncManagerStatus(employeeData);
    
    toast.success(isNewEmployee 
      ? `Employé ${employeeData.firstName} ${employeeData.lastName} créé avec succès` 
      : `Employé ${employeeData.firstName} ${employeeData.lastName} mis à jour avec succès`
    );
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'employé:", error);
    toast.error("Erreur lors de la sauvegarde de l'employé");
    return null;
  }
};
