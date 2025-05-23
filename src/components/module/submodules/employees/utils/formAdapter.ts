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
    streetNumber: formValues.streetNumber,
    streetName: formValues.streetName,
    city: formValues.city,
    zipCode: formValues.zipCode,
    region: formValues.region,
    updatedAt: new Date().toISOString(),
  };

  // Handle workAddress if provided
  if (formValues.workAddress) {
    employeeData.workAddress = {
      street: formValues.workAddress.street,
      city: formValues.workAddress.city,
      postalCode: formValues.workAddress.postalCode,
      country: formValues.workAddress.country
    };
  }

  // Keep existing ID if it exists (for updates)
  if (existingEmployee?.id) {
    employeeData.id = existingEmployee.id;
  }

  // Preserve existing photo if no new one is provided
  if (formValues.photo) {
    employeeData.photo = formValues.photo;
    employeeData.photoURL = formValues.photo;
    employeeData.photoData = formValues.photo;
  } else if (existingEmployee?.photo) {
    employeeData.photo = existingEmployee.photo;
    employeeData.photoURL = existingEmployee.photoURL;
    employeeData.photoData = existingEmployee.photoData;
  }

  // Gestion des métadonnées de photo
  if (formValues.photoMeta) {
    const photoMeta: EmployeePhotoMeta = {
      fileName: formValues.photoMeta.fileName || `photo_${Date.now()}.jpg`,
      fileType: formValues.photoMeta.fileType || 'image/jpeg',
      fileSize: formValues.photoMeta.fileSize || 0,
      updatedAt: formValues.photoMeta.updatedAt || new Date().toISOString(),
      data: formValues.photoMeta.data
    };
    
    employeeData.photoMeta = photoMeta;
  } else if (formValues.photo && !employeeData.photoMeta) {
    employeeData.photoMeta = createPhotoMeta(formValues.photo);
  } else if (existingEmployee?.photoMeta) {
    // Preserve existing photoMeta if no new photo is provided
    employeeData.photoMeta = existingEmployee.photoMeta;
  }

  // Si c'est un nouvel employé, ajouter la date de création
  if (!existingEmployee || !existingEmployee.id) {
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

  // Get work address if it exists
  const workAddress = employee.workAddress && typeof employee.workAddress === 'object' ? {
    street: employee.workAddress.street || '',
    city: employee.workAddress.city || '',
    postalCode: employee.workAddress.postalCode || '',
    country: employee.workAddress.country || ''
  } : undefined;

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
    region: employee.region || '',
    workAddress: workAddress
  };
};
