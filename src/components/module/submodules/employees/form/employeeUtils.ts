import { EmployeeFormValues } from './employeeFormSchema';
import { Employee } from '@/types/employee';
import { createPhotoMeta } from '../utils/photoUtils';

/**
 * Convertit un formulaire employé en objet employee
 */
export const formToEmployee = (formData: EmployeeFormValues, existingEmployee?: Partial<Employee>): Partial<Employee> => {
  // Create base employee object
  const employee: Partial<Employee> = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || '',
    position: formData.position || '',
    professionalEmail: formData.professionalEmail || '',
    department: formData.department || '',
    company: formData.company || '',
    status: formData.status,
    contract: formData.contract,
    hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
    birthDate: formData.birthDate || '',
    managerId: formData.managerId || '',
    forceManager: formData.forceManager,
    isManager: formData.isManager,
    streetNumber: formData.streetNumber,
    streetName: formData.streetName,
    city: formData.city,
    zipCode: formData.zipCode,
    region: formData.region
  };

  // Handle photo and photoMeta
  if (formData.photo) {
    employee.photo = formData.photo;
    employee.photoURL = formData.photo;
    employee.photoData = formData.photo;
  }

  // Handle photoMeta
  if (formData.photoMeta) {
    employee.photoMeta = formData.photoMeta;
  } else if (formData.photo && !employee.photoMeta) {
    // Create photo metadata if photo exists but no metadata
    employee.photoMeta = createPhotoMeta(formData.photo);
  }

  // Keep existing data
  if (existingEmployee) {
    employee.id = existingEmployee.id;
    employee.createdAt = existingEmployee.createdAt;
    employee.updatedAt = new Date().toISOString();
  } else {
    employee.id = crypto.randomUUID();
    employee.createdAt = new Date().toISOString();
    employee.updatedAt = new Date().toISOString();
  }

  return employee;
};

/**
 * Convertit un objet employee en données de formulaire
 */
export const employeeToForm = (employee: Partial<Employee>): EmployeeFormValues => {
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
    position: employee.position || '',
    professionalEmail: employee.professionalEmail || '',
    department: employee.department || '',
    company: typeof employee.company === 'string' ? employee.company : '',
    status: (employee.status || 'active') as any,
    contract: employee.contract || 'cdi',
    hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
    birthDate: employee.birthDate || '',
    managerId: employee.managerId || '',
    photo: employee.photo || employee.photoURL || '',
    photoMeta: photoMeta,
    forceManager: employee.forceManager || false,
    isManager: employee.isManager || false,
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || ''
  };
};
