
import { Department, DepartmentFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const createEmptyFormData = (): DepartmentFormData => {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    managerId: '',
    color: '#3b82f6',
    companyId: '',
    employeeIds: []
  };
};

export const prepareDepartmentFromForm = (
  formData: DepartmentFormData, 
  selectedEmployees: string[], 
  allEmployees: any[], 
  companies: any[]
): Department => {
  // Ensure we have arrays to work with
  const safeAllEmployees = Array.isArray(allEmployees) ? allEmployees : [];
  const safeCompanies = Array.isArray(companies) ? companies : [];
  
  // Find the selected manager from all employees
  const selectedManager = formData.managerId && formData.managerId !== "none" 
    ? safeAllEmployees.find(emp => emp && emp.id === formData.managerId) 
    : null;

  const managerName = selectedManager 
    ? `${selectedManager.firstName || ''} ${selectedManager.lastName || ''}`.trim() 
    : null;
  
  // Find the selected company from all companies
  const selectedCompany = formData.companyId && formData.companyId !== "none" 
    ? safeCompanies.find(comp => comp && comp.id === formData.companyId)
    : null;
    
  const companyName = selectedCompany 
    ? selectedCompany.name
    : null;
  
  // Safe check for selected employees
  const safeSelectedEmployees = Array.isArray(selectedEmployees) ? selectedEmployees : [];
  
  // Create department object with safe checks for arrays
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId === "none" ? null : formData.managerId,
    managerName: managerName,
    companyId: formData.companyId === "none" ? null : formData.companyId,
    companyName: companyName,
    color: formData.color || '#3b82f6',
    employeeIds: safeSelectedEmployees,
    employeesCount: safeSelectedEmployees.length,
    createdAt: formData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// New function to deduplicate departments
export const deduplicateDepartments = (departments: Department[]): Department[] => {
  if (!Array.isArray(departments) || departments.length === 0) return [];
  
  // Use a Map to deduplicate by ID
  const uniqueDepartments = new Map<string, Department>();
  
  departments.forEach(dept => {
    if (dept && dept.id && !uniqueDepartments.has(dept.id)) {
      uniqueDepartments.set(dept.id, dept);
    }
  });
  
  return Array.from(uniqueDepartments.values());
};
