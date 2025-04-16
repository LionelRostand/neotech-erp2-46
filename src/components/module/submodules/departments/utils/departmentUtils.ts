
import { v4 as uuidv4 } from 'uuid';
import { Department, DepartmentFormData } from '../types';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';

export const createEmptyFormData = (departments: Department[] = []): DepartmentFormData => {
  const deptId = `dept-${departments.length + 1}`;

  return {
    id: deptId,
    name: '',
    description: '',
    managerId: '',
    companyId: '',
    color: '#3b82f6',
    employeeIds: [],
  };
};

export const prepareDepartmentFromForm = (
  formData: DepartmentFormData, 
  selectedEmployees: string[],
  employees: Employee[] = [],
  companies: Company[] = []
): Department => {
  // Find the selected manager and get their name
  const selectedManager = formData.managerId
    ? employees.find(employee => employee.id === formData.managerId)
    : null;
  const managerName = selectedManager 
    ? `${selectedManager.firstName} ${selectedManager.lastName}`
    : null;

  // Find the selected company and get its name
  const selectedCompany = formData.companyId
    ? companies.find(company => company.id === formData.companyId)
    : null;
  const companyName = selectedCompany
    ? selectedCompany.name
    : null;

  // Create a new department object
  const department: Department = {
    id: formData.id || `dept-${uuidv4().substring(0, 8)}`,
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId || null,
    managerName: managerName,
    companyId: formData.companyId || null,
    companyName: companyName,
    color: formData.color,
    employeeIds: selectedEmployees,
    employeesCount: selectedEmployees.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return department;
};
