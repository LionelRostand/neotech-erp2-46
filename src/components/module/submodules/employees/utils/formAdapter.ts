
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from '../form/employeeFormSchema';

/**
 * Convert employee form values to employee data object
 */
export const formValuesToEmployee = (formValues: EmployeeFormValues, existingEmployee?: Partial<Employee>): Partial<Employee> => {
  const employeeData: Partial<Employee> = {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    email: formValues.email,
    phone: formValues.phone || '',
    company: formValues.company || '',
    // Ensure department is never an empty string
    department: formValues.department && formValues.department !== "" 
      ? formValues.department === "no_department" ? "Aucun" : formValues.department 
      : "Aucun",
    position: formValues.position || '',
    status: formValues.status,
    // Preserve existing fields
    ...(existingEmployee && {
      id: existingEmployee.id,
      createdAt: existingEmployee.createdAt,
      photoURL: existingEmployee.photoURL,
    }),
    // New fields
    updatedAt: new Date().toISOString()
  };

  if (formValues.hireDate) {
    employeeData.hireDate = formValues.hireDate;
  }

  if (formValues.birthDate) {
    employeeData.birthDate = formValues.birthDate;
  }

  if (formValues.photoMeta) {
    employeeData.photoMeta = formValues.photoMeta;
  }

  if (formValues.photo) {
    employeeData.photo = formValues.photo;
    employeeData.photoURL = formValues.photo;
  }
  
  return employeeData;
};

/**
 * Convert employee data object to form values
 */
export const employeeToFormValues = (employee: Partial<Employee>): EmployeeFormValues => {
  return {
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    company: employee.company || '',
    // Ensure department is never an empty string
    department: employee.department && employee.department !== "" 
      ? employee.department 
      : "no_department",
    position: employee.position || '',
    hireDate: employee.hireDate || '',
    birthDate: employee.birthDate || '',
    status: (employee.status || 'active') as any,
    photo: employee.photo || employee.photoURL || '',
    photoMeta: employee.photoMeta,
    contract: employee.contract || 'cdi',
    managerId: employee.managerId || '',
    forceManager: employee.forceManager || false,
    isManager: employee.isManager || false,
    professionalEmail: employee.professionalEmail || '',
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || '',
    country: employee.country || '',
    workAddress: employee.workAddress ? {
      street: employee.workAddress.street || '',
      city: employee.workAddress.city || '',
      postalCode: employee.workAddress.postalCode || '',
      country: employee.workAddress.country || ''
    } : undefined
  };
};
