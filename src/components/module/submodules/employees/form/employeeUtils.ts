
import { Employee, EmployeeAddress } from '@/types/employee';
import { EmployeeFormValues } from './employeeFormSchema';
import { v4 as uuidv4 } from 'uuid';

export const prepareEmployeeData = (data: EmployeeFormValues): Partial<Employee> => {
  // Convert the address to the address object structure
  let addressObj: EmployeeAddress;
  
  if (typeof data.address === 'string') {
    // Handle string address - ensure all required fields have values
    const addressParts = data.address.split(',').map(part => part.trim());
    addressObj = {
      street: addressParts[0] || 'Rue non spécifiée', // Ensure required fields are never empty
      city: addressParts[1] || 'Ville non spécifiée',
      postalCode: addressParts[2] || '00000',
      country: addressParts[3] || 'France',
      // Do not include optional fields with undefined values
      ...(addressParts[4] ? { state: addressParts[4] } : {}),
      // Don't set streetNumber or department if they're undefined
    };
  } else if (data.address && typeof data.address === 'object') {
    // Handle object address, ensuring required fields have values
    // and filtering out undefined values for optional fields
    addressObj = {
      street: data.address.street || 'Rue non spécifiée',
      city: data.address.city || 'Ville non spécifiée',
      postalCode: data.address.postalCode || '00000',
      country: data.address.country || 'France',
      // Only include optional fields if they have values
      ...(data.address.streetNumber ? { streetNumber: data.address.streetNumber } : {}),
      ...(data.address.department ? { department: data.address.department } : {}),
      ...(data.address.state ? { state: data.address.state } : {})
    };
  } else {
    // Default empty address with required fields
    addressObj = {
      street: 'Rue non spécifiée',
      city: 'Ville non spécifiée',
      postalCode: '00000',
      country: 'France'
    };
  }

  // Generate a reliable employee ID that won't change from session to session
  // Fix: Check for employeeId in the data parameter directly, not data.id which doesn't exist
  const employeeId = data.employeeId || `EMP${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Include userId if it's provided, otherwise generate a new one (useful for user account creation)
  const userId = data.userId || uuidv4();
  
  console.log(`Préparation des données pour l'employé avec ID: ${employeeId}, userId: ${userId}`);
  
  return {
    id: employeeId,
    userId, // Now this is valid because we updated the Employee interface
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || '',
    address: addressObj, // This is now a properly formed EmployeeAddress object without undefined values
    department: data.department || '',
    departmentId: data.department || '',
    position: data.position || '',
    contract: data.contract || '',
    hireDate: data.hireDate || '',
    manager: data.manager || '',
    managerId: '',
    status: data.status as 'active' | 'inactive' | 'onLeave' | 'Actif',
    company: data.company || '',
    professionalEmail: data.professionalEmail || '',
    skills: [],
    education: [],
    documents: [],
    workSchedule: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 17:00',
    },
    payslips: [],
    // Add these required fields with default values
    photo: '',
    photoURL: '',
    title: data.position || '',
    role: '',
    startDate: data.hireDate || '',
    socialSecurityNumber: '',
    birthDate: ''
  };
};
