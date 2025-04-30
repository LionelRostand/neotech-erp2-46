
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from '../form/employeeFormSchema';

/**
 * Convertit un objet employee en données de formulaire
 */
export const employeeToFormValues = (employee: Partial<Employee>): EmployeeFormValues => {
  return {
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    position: employee.position || '',
    professionalEmail: employee.professionalEmail || '',
    department: employee.department || employee.departmentId || '',
    company: typeof employee.company === 'string' ? employee.company : (employee.company?.id || ''),
    status: (employee.status || 'active') as any,
    contract: employee.contract || 'cdi',
    hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
    birthDate: employee.birthDate || '',
    managerId: employee.managerId || '',
    photo: employee.photo || employee.photoURL || '',
    photoMeta: employee.photoMeta,
    forceManager: employee.forceManager || false,
    isManager: employee.isManager || false,
    // Adresse
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || employee.postalCode || '',
    region: employee.region || '',
    country: employee.country || '',
    // Adresse professionnelle
    workAddress: employee.workAddress
  };
};

/**
 * Convertit des données de formulaire en objet employee
 */
export const formValuesToEmployee = (formData: EmployeeFormValues, existingEmployee?: Partial<Employee>): Partial<Employee> => {
  const employee: Partial<Employee> = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || '',
    position: formData.position || '',
    professionalEmail: formData.professionalEmail || '',
    department: formData.department || '',
    departmentId: formData.department || '',
    company: formData.company || '',
    status: formData.status,
    contract: formData.contract,
    hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
    birthDate: formData.birthDate || '',
    managerId: formData.managerId || '',
    forceManager: formData.forceManager,
    isManager: formData.isManager,
    
    // Adresse
    streetNumber: formData.streetNumber,
    streetName: formData.streetName,
    city: formData.city,
    zipCode: formData.zipCode,
    postalCode: formData.zipCode,
    region: formData.region,
    country: formData.country,
    
    // Photo handling
    photo: formData.photo,
    photoURL: formData.photo, // Ensure photoURL is set
    photoMeta: formData.photoMeta
  };

  // Add work address if provided
  if (formData.workAddress) {
    employee.workAddress = formData.workAddress;
  }

  // Keep existing ID if updating
  if (existingEmployee?.id) {
    employee.id = existingEmployee.id;
  }

  // Keep existing timestamps if available
  if (existingEmployee?.createdAt) {
    employee.createdAt = existingEmployee.createdAt;
  } else {
    employee.createdAt = new Date().toISOString();
  }

  // Add updatedAt timestamp
  employee.updatedAt = new Date().toISOString();
  
  return employee;
};
