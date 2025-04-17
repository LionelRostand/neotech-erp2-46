import { EmployeeFormValues } from './employeeFormSchema';
import { Employee, EmployeePhotoMeta } from '@/types/employee';

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

  if (formData.photoMeta) {
    employee.photoMeta = formData.photoMeta;
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
    photoMeta: employee.photoMeta,
    forceManager: employee.forceManager || false,
    isManager: employee.isManager || false,
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || ''
  };
};
