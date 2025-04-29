
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from '../form/employeeFormSchema';

/**
 * Convert employee form values to employee data object
 */
export const formValuesToEmployee = (formValues: EmployeeFormValues, existingEmployee?: Partial<Employee>): Partial<Employee> => {
  // Ensure we have valid input objects
  const safeFormValues = formValues || {};
  const safeExistingEmployee = existingEmployee || {};
  
  const employeeData: Partial<Employee> = {
    firstName: safeFormValues.firstName || '',
    lastName: safeFormValues.lastName || '',
    email: safeFormValues.email || '',
    phone: safeFormValues.phone || '',
    company: safeFormValues.company || '',
    // Ensure department is never an empty string
    department: safeFormValues.department && safeFormValues.department !== "" 
      ? safeFormValues.department === "no_department" ? "Aucun" : safeFormValues.department 
      : "Aucun",
    position: safeFormValues.position || '',
    status: safeFormValues.status || 'active',
    // Preserve existing fields
    ...(safeExistingEmployee && {
      id: safeExistingEmployee.id,
      createdAt: safeExistingEmployee.createdAt,
      photoURL: safeExistingEmployee.photoURL,
    }),
    // New fields
    updatedAt: new Date().toISOString()
  };

  if (safeFormValues.hireDate) {
    employeeData.hireDate = safeFormValues.hireDate;
  }

  if (safeFormValues.birthDate) {
    employeeData.birthDate = safeFormValues.birthDate;
  }

  if (safeFormValues.photoMeta) {
    employeeData.photoMeta = safeFormValues.photoMeta;
  }

  if (safeFormValues.photo) {
    employeeData.photo = safeFormValues.photo;
    employeeData.photoURL = safeFormValues.photo;
  }
  
  return employeeData;
};

/**
 * Convert employee data object to form values
 */
export const employeeToFormValues = (employee: Partial<Employee>): EmployeeFormValues => {
  // Ensure we have a valid employee object
  const safeEmployee = employee || {};
  
  return {
    firstName: safeEmployee.firstName || '',
    lastName: safeEmployee.lastName || '',
    email: safeEmployee.email || '',
    phone: safeEmployee.phone || '',
    company: safeEmployee.company || '',
    // Ensure department is never an empty string
    department: safeEmployee.department && safeEmployee.department !== "" 
      ? safeEmployee.department === "Aucun" ? "no_department" : safeEmployee.department
      : "no_department",
    position: safeEmployee.position || '',
    hireDate: safeEmployee.hireDate || '',
    birthDate: safeEmployee.birthDate || '',
    status: (safeEmployee.status || 'active') as any,
    photo: safeEmployee.photo || safeEmployee.photoURL || '',
    photoMeta: safeEmployee.photoMeta || undefined,
    contract: safeEmployee.contract || 'cdi',
    managerId: safeEmployee.managerId || '',
    forceManager: Boolean(safeEmployee.forceManager),
    isManager: Boolean(safeEmployee.isManager),
    professionalEmail: safeEmployee.professionalEmail || '',
    streetNumber: safeEmployee.streetNumber || '',
    streetName: safeEmployee.streetName || '',
    city: safeEmployee.city || '',
    zipCode: safeEmployee.zipCode || '',
    region: safeEmployee.region || '',
    country: safeEmployee.country || '',
    workAddress: safeEmployee.workAddress ? {
      street: safeEmployee.workAddress.street || '',
      city: safeEmployee.workAddress.city || '',
      postalCode: safeEmployee.workAddress.postalCode || '',
      country: safeEmployee.workAddress.country || ''
    } : undefined
  };
};
