
import { Department } from '../types';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';

// Event bus mechanism for department updates
const subscribers: ((departments: Department[]) => void)[] = [];

export const subscribeToDepartmentUpdates = (callback: (departments: Department[]) => void) => {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
};

export const notifyDepartmentUpdates = (departments: Department[]) => {
  console.log(`Notifying ${subscribers.length} subscribers about department updates`);
  subscribers.forEach(callback => callback(departments));
};

/**
 * Converts form data to a department object
 */
export const prepareDepartmentFromForm = (
  formData: any, 
  selectedEmployees: string[], 
  allEmployees: Employee[], 
  companies: Company[]
): Department => {
  // Find the selected manager from all employees
  const selectedManager = formData.managerId && formData.managerId !== "none"
    ? allEmployees.find(emp => emp.id === formData.managerId) 
    : null;

  // Ensure manager properties are handled safely
  const managerName = selectedManager 
    ? `${selectedManager.firstName || ''} ${selectedManager.lastName || ''}`.trim() 
    : '';

  // Find the selected company from all companies
  const selectedCompany = formData.companyId && formData.companyId !== "none"
    ? companies.find(comp => comp.id === formData.companyId)
    : null;

  // Ensure company properties are handled safely
  const companyName = selectedCompany ? (selectedCompany.name || '') : '';

  // Create the department object with safe defaults for all required fields
  return {
    id: formData.id || `dept-${Date.now()}`,
    name: formData.name || '',
    description: formData.description || '',
    managerId: formData.managerId === "none" ? null : (formData.managerId || null),
    managerName: managerName,
    companyId: formData.companyId === "none" ? null : (formData.companyId || null),
    companyName: companyName,
    color: formData.color || '#3B82F6',
    employeeIds: selectedEmployees || [],
    employeesCount: (selectedEmployees || []).length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
