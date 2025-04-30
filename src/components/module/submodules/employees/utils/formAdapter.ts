
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from '../form/employeeFormSchema';

/**
 * Convert employee form values to employee data object
 */
export const formValuesToEmployee = (formValues: EmployeeFormValues, existingEmployee?: Partial<Employee>): Partial<Employee> => {
  // Ensure we have valid input objects
  const safeFormValues = formValues || {};
  const safeExistingEmployee = existingEmployee || {};
  
  // Build personal address
  const personalAddress = {
    street: `${safeFormValues.streetNumber || ''} ${safeFormValues.streetName || ''}`.trim(),
    city: safeFormValues.city || '',
    postalCode: safeFormValues.zipCode || '',
    country: safeFormValues.country || '',
    state: safeFormValues.region || ''
  };

  // Build work address
  const workAddress = safeFormValues.workAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  };
  
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
    // Add address data
    address: personalAddress,
    workAddress: workAddress,
    // Store individual address components for compatibility
    streetNumber: safeFormValues.streetNumber || '',
    streetName: safeFormValues.streetName || '',
    city: safeFormValues.city || '',
    zipCode: safeFormValues.zipCode || '',
    postalCode: safeFormValues.zipCode || '',
    region: safeFormValues.region || '',
    country: safeFormValues.country || '',
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
  
  if (safeFormValues.professionalEmail) {
    employeeData.professionalEmail = safeFormValues.professionalEmail;
  }

  if (safeFormValues.contract) {
    employeeData.contract = safeFormValues.contract;
  }
  
  return employeeData;
};

/**
 * Convert employee data object to form values
 */
export const employeeToFormValues = (employee: Partial<Employee>): EmployeeFormValues => {
  // Ensure we have a valid employee object
  const safeEmployee = employee || {};
  
  // Extract address data
  let streetNumber = '';
  let streetName = '';
  let city = '';
  let zipCode = '';
  let region = '';
  let country = '';
  
  // Extract from address object if it exists
  if (safeEmployee.address && typeof safeEmployee.address === 'object') {
    const address = safeEmployee.address;
    // Try to extract street number and name from street field
    if (address.street) {
      const streetParts = address.street.split(' ');
      if (streetParts.length > 1) {
        streetNumber = streetParts[0];
        streetName = streetParts.slice(1).join(' ');
      } else {
        streetName = address.street;
      }
    }
    city = address.city || '';
    zipCode = address.postalCode || '';
    region = address.state || '';
    country = address.country || '';
  } else {
    // Use flat properties if no address object
    streetNumber = safeEmployee.streetNumber || '';
    streetName = safeEmployee.streetName || '';
    city = safeEmployee.city || '';
    zipCode = safeEmployee.zipCode || safeEmployee.postalCode || '';
    region = safeEmployee.region || '';
    country = safeEmployee.country || '';
  }
  
  // Prepare work address if it exists
  const workAddress = safeEmployee.workAddress as any;

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
    // Address fields
    streetNumber,
    streetName,
    city,
    zipCode,
    region,
    country,
    // Work address
    workAddress: workAddress ? {
      street: workAddress.street || '',
      city: workAddress.city || '',
      postalCode: workAddress.postalCode || '',
      country: workAddress.country || ''
    } : {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  };
};
