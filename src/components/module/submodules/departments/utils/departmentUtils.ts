
import { Department, DepartmentFormData } from '../types';
import { Employee } from '@/types/employee';
import { employees } from '@/data/employees';

// Store department data in local storage for hierarchy component to access
const DEPARTMENTS_STORAGE_KEY = 'hierarchy_departments_data';

export const createDefaultDepartments = (): Department[] => {
  return [
    {
      id: "DEP001",
      name: "Marketing",
      description: "Responsable de la stratégie marketing et de la communication",
      managerId: "EMP003",
      managerName: "Sophie Martin",
      employeesCount: 2,
      color: "#3b82f6", // blue-500
      employeeIds: ["EMP003", "EMP004"]
    },
    {
      id: "DEP002",
      name: "Direction",
      description: "Direction générale de l'entreprise",
      managerId: "EMP002",
      managerName: "Lionel Djossa",
      employeesCount: 1,
      color: "#10b981", // emerald-500
      employeeIds: ["EMP002"]
    }
  ];
};

export const generateDepartmentId = (departments: Department[]): string => {
  return `DEP${(departments.length + 1).toString().padStart(3, '0')}`;
};

export const createEmptyFormData = (departments: Department[]): DepartmentFormData => {
  return {
    id: generateDepartmentId(departments),
    name: "",
    description: "",
    managerId: "",
    color: "#3b82f6",
    employeeIds: []
  };
};

export const prepareDepartmentFromForm = (
  formData: DepartmentFormData, 
  selectedEmployees: string[],
  currentDepartment?: Department
): Department => {
  const selectedManager = formData.managerId 
    ? employees.find(emp => emp.id === formData.managerId) 
    : null;

  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId || null,
    managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
    employeesCount: selectedEmployees.length,
    color: formData.color,
    employeeIds: selectedEmployees,
    ...(currentDepartment && { ...currentDepartment })
  };
};

export const getDepartmentEmployees = (departmentId: string, departments: Department[]): Employee[] => {
  const department = departments.find(dep => dep.id === departmentId);
  if (!department || !department.employeeIds) return [];
  
  return employees.filter(emp => department.employeeIds.includes(emp.id));
};

// Function to sync departments with hierarchy component
export const syncDepartmentsWithHierarchy = (departments: Department[]) => {
  try {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(departments));
    console.log("Departments synced with hierarchy:", departments);
  } catch (error) {
    console.error("Error syncing departments with hierarchy:", error);
  }
};

// Function for hierarchy component to get synced departments
export const getSyncedDepartments = (): Department[] => {
  try {
    const data = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error getting synced departments:", error);
  }
  return [];
};
