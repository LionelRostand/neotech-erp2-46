
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
    // Adresse
    streetNumber: employee.streetNumber || '',
    streetName: employee.streetName || '',
    city: employee.city || '',
    zipCode: employee.zipCode || '',
    region: employee.region || '',
    country: employee.country || '',
    // Adresse professionnelle
    workAddress: employee.workAddress
  };
};
