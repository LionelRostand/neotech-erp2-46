
import { Department, DepartmentFormData } from '../types';
import { employees } from '@/data/employees';

// Create empty form data with a new ID
export const createEmptyFormData = (departments: Department[]): DepartmentFormData => {
  // Generate a new unique ID
  const lastId = departments.length > 0 
    ? Math.max(...departments.map(d => parseInt(d.id.replace('DEP', ''))))
    : 0;
  
  const newId = `DEP${(lastId + 1).toString().padStart(3, '0')}`;
  
  return {
    id: newId,
    name: '',
    description: '',
    managerId: '',
    color: '#3b82f6', // Default color (blue-500)
    employeeIds: []
  };
};

// Create default departments for new installs
export const createDefaultDepartments = (): Department[] => {
  return [
    {
      id: 'DEP001',
      name: 'Direction',
      description: 'Département de direction générale',
      managerId: 'EMP002', // Lionel Djossa
      employeeIds: ['EMP002'],
      employeesCount: 1,
      color: '#10b981', // emerald-500
      managerName: 'Lionel Djossa'
    },
    {
      id: 'DEP002',
      name: 'Marketing',
      description: 'Département marketing et communication',
      managerId: 'EMP003', // Sophie Martin
      employeeIds: ['EMP001', 'EMP003'],
      employeesCount: 2,
      color: '#3b82f6', // blue-500
      managerName: 'Sophie Martin'
    }
  ];
};

// Prepare department data from form values
export const prepareDepartmentFromForm = (
  formData: DepartmentFormData, 
  selectedEmployees: string[],
  existingDepartment?: Department
): Department => {
  // Make sure to use the passed selectedEmployees array
  console.log("prepareDepartmentFromForm - selectedEmployees:", selectedEmployees);
  
  // Start with existing department data if available
  const department: Department = existingDepartment 
    ? { ...existingDepartment } 
    : {
        id: formData.id,
        name: '',
        description: '',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '',
        employeeIds: []
      };
  
  // Update with form data
  department.name = formData.name;
  department.description = formData.description;
  department.managerId = formData.managerId === 'none' ? null : formData.managerId;
  department.color = formData.color;
  
  // Set manager name if manager ID is provided
  if (department.managerId) {
    const manager = employees.find(e => e.id === department.managerId);
    if (manager) {
      department.managerName = `${manager.firstName} ${manager.lastName}`;
    }
  } else {
    department.managerName = null;
  }
  
  // Important: Use the passed selectedEmployees array
  department.employeeIds = selectedEmployees;
  department.employeesCount = selectedEmployees.length;
  
  return department;
};

// Get employees for a specific department
export const getDepartmentEmployees = (departmentId: string, departments: Department[]) => {
  const department = departments.find(d => d.id === departmentId);
  
  if (!department || !department.employeeIds) {
    return [];
  }
  
  return employees.filter(e => department.employeeIds?.includes(e.id));
};
