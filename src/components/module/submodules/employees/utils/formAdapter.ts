
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { Employee, EmployeePhotoMeta } from '@/types/employee';
import { createPhotoMeta } from './photoUtils';

/**
 * Convertit les valeurs du formulaire en format d'employé
 * @param formValues Valeurs du formulaire
 * @param existingEmployee Données existantes de l'employé (pour la mise à jour)
 * @returns Objet employé formaté
 */
export const formValuesToEmployee = (
  formValues: EmployeeFormValues, 
  existingEmployee?: Partial<Employee>
): Partial<Employee> => {
  // Créer l'objet employé à partir des valeurs du formulaire
  const employeeData: Partial<Employee> = {
    ...existingEmployee,
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    email: formValues.email,
    phone: formValues.phone,
    company: formValues.company,
    department: formValues.department,
    position: formValues.position,
    contract: formValues.contract,
    hireDate: formValues.hireDate,
    birthDate: formValues.birthDate,
    managerId: formValues.managerId,
    status: formValues.status,
    professionalEmail: formValues.professionalEmail,
    forceManager: formValues.forceManager,
    isManager: formValues.isManager,
    // Ajouter les champs d'adresse
    streetNumber: formValues.streetNumber,
    streetName: formValues.streetName,
    city: formValues.city,
    zipCode: formValues.zipCode,
    region: formValues.region,
    // Conserver l'ID existant si disponible
    id: existingEmployee?.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };

  // Gestion de la photo
  if (formValues.photo) {
    employeeData.photo = formValues.photo;
    employeeData.photoURL = formValues.photo;
    employeeData.photoData = formValues.photo;
  }

  // Gestion des métadonnées de photo
  if (formValues.photoMeta) {
    employeeData.photoMeta = {
      fileName: formValues.photoMeta.fileName || `photo_${Date.now()}.jpg`,
      fileType: formValues.photoMeta.fileType || 'image/jpeg',
      fileSize: formValues.photoMeta.fileSize || 100000,
      updatedAt: formValues.photoMeta.updatedAt || new Date().toISOString()
    };
    
    // Only add data if it exists
    if (formValues.photoMeta.data) {
      employeeData.photoMeta = {
        ...employeeData.photoMeta,
        data: formValues.photoMeta.data
      };
    }
  } else if (formValues.photo && !employeeData.photoMeta) {
    // Create photo metadata if photo exists but no metadata
    employeeData.photoMeta = createPhotoMeta(formValues.photo);
  }

  // Si c'est un nouvel employé, ajouter la date de création
  if (!existingEmployee) {
    employeeData.createdAt = new Date().toISOString();
  }

  return employeeData;
};

/**
 * Convertit un objet employé en valeurs de formulaire
 * @param employee Données de l'employé
 * @returns Valeurs du formulaire
 */
export const employeeToFormValues = (
  employee: Partial<Employee>
): EmployeeFormValues => {
  // Make sure we have default values for required photoMeta fields if they exist
  let photoMeta = employee.photoMeta;
  if (photoMeta && (!photoMeta.fileName || !photoMeta.fileType || !photoMeta.fileSize || !photoMeta.updatedAt)) {
    photoMeta = {
      ...photoMeta,
      fileName: photoMeta.fileName || `photo_${Date.now()}.jpg`,
      fileType: photoMeta.fileType || 'image/jpeg',
      fileSize: photoMeta.fileSize || 100000,
      updatedAt: photoMeta.updatedAt || new Date().toISOString()
    };
  }

  return {
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    company: typeof employee.company === 'string' ? employee.company : '',
    department: employee.department || '',
    position: employee.position || '',
    contract: employee.contract || 'cdi',
    hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
    birthDate: employee.birthDate || '',
    managerId: employee.managerId || '',
    status: (employee.status || 'active') as any,
    photo: employee.photo || employee.photoURL || employee.photoData || '',
    photoMeta: photoMeta,
    professionalEmail: employee.professionalEmail || '',
    forceManager: employee.forceManager || false,
    isManager: employee.isManager || false,
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || ''
  };
};
