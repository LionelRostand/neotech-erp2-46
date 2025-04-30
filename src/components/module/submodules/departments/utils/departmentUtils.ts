
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
  // Find the selected manager from all employees
  const selectedManager = formData.managerId && formData.managerId !== "none" && Array.isArray(allEmployees)
    ? allEmployees.find(emp => emp && emp.id === formData.managerId) 
    : null;

  const managerName = selectedManager 
    ? `${selectedManager.firstName || ''} ${selectedManager.lastName || ''}`.trim() 
    : null;
  
  // Find the selected company from all companies
  const selectedCompany = formData.companyId && formData.companyId !== "none" && Array.isArray(companies)
    ? companies.find(comp => comp && comp.id === formData.companyId)
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
