
import { v4 as uuidv4 } from 'uuid';
import { Department, DepartmentFormData } from '../components/module/submodules/departments/types';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';

// Create an event bus for department updates
type EventListener = () => void;
const eventListeners: EventListener[] = [];

/**
 * Notify subscribers when departments are updated
 * @param departments The updated departments
 */
export const notifyDepartmentUpdates = (departments: Department[]) => {
  console.log(`Notifying ${eventListeners.length} subscribers about department updates`);
  // Trigger all event listeners
  eventListeners.forEach(listener => listener());
};

/**
 * Subscribe to department updates
 * @param callback Function to call when departments are updated
 * @returns Function to unsubscribe
 */
export const subscribeToDepartmentUpdates = (callback: EventListener): (() => void) => {
  console.log('New subscriber to department updates');
  eventListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
      console.log('Unsubscribed from department updates');
    }
  };
};

// Employee service functions
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    // Generate a unique ID for the new employee
    const employeeId = `emp-${uuidv4().substring(0, 8)}`;
    
    // Create a new employee object with all required fields
    const newEmployee = {
      id: employeeId,
      firstName: employeeData.firstName || '',
      lastName: employeeData.lastName || '',
      email: employeeData.email || '',
      phone: employeeData.phone || '',
      position: employeeData.position || '',
      department: employeeData.department || null,
      departmentId: employeeData.departmentId || '',
      hireDate: employeeData.hireDate || new Date().toISOString(),
      startDate: employeeData.startDate || new Date().toISOString(),
      isManager: employeeData.isManager || false,
      managerId: employeeData.managerId || null,
      address: employeeData.address || '',
      birthDate: employeeData.birthDate || null,
      photo: employeeData.photo || null,
      photoURL: employeeData.photoURL || '',
      status: employeeData.status || 'active',
      skills: employeeData.skills || [],
      contract: employeeData.contract || null,
      // Add fields that were missing
      documents: employeeData.documents || [],
      company: employeeData.company || '',
      role: employeeData.role || 'Employé',
      title: employeeData.title || '',
      professionalEmail: employeeData.professionalEmail || '',
      workSchedule: employeeData.workSchedule || {},
      payslips: employeeData.payslips || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      socialSecurityNumber: employeeData.socialSecurityNumber || '',
    } as Employee;
    
    // Handle the salary property separately as it may not be in the Employee type
    if ('salary' in employeeData) {
      (newEmployee as any).salary = employeeData.salary;
    }
    
    console.log('Created new employee:', newEmployee);
    
    // In a real app, this would save to a database
    // Here we just return the new employee object
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error);
    return null;
  }
};

export const updateEmployeeDoc = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    // In a real app, this would update the database
    // For now, we just return a merged employee object with all required fields
    const updatedEmployee = {
      id,
      firstName: employeeData.firstName || '',
      lastName: employeeData.lastName || '',
      email: employeeData.email || '',
      phone: employeeData.phone || '',
      position: employeeData.position || '',
      department: employeeData.department || null,
      departmentId: employeeData.departmentId || '',
      hireDate: employeeData.hireDate || new Date().toISOString(),
      startDate: employeeData.startDate || new Date().toISOString(),
      isManager: employeeData.isManager || false,
      managerId: employeeData.managerId || null,
      address: employeeData.address || '',
      birthDate: employeeData.birthDate || null,
      photo: employeeData.photo || null,
      photoURL: employeeData.photoURL || '',
      status: employeeData.status || 'active',
      skills: employeeData.skills || [],
      contract: employeeData.contract || null,
      // Add fields that were missing
      documents: employeeData.documents || [],
      company: employeeData.company || '',
      role: employeeData.role || 'Employé',
      title: employeeData.title || '',
      professionalEmail: employeeData.professionalEmail || '',
      workSchedule: employeeData.workSchedule || {},
      payslips: employeeData.payslips || [],
      createdAt: employeeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      socialSecurityNumber: employeeData.socialSecurityNumber || '',
    } as Employee;
    
    // Handle the salary property separately as it may not be in the Employee type
    if ('salary' in employeeData) {
      (updatedEmployee as any).salary = employeeData.salary;
    }
    
    console.log('Updated employee:', updatedEmployee);
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee:', error);
    return null;
  }
};

export const syncManagerStatus = async (employee: Employee): Promise<void> => {
  try {
    // In a real app, this would update related departments and employees
    // For now, just log the action
    console.log(`Syncing manager status for employee ${employee.id}`);
    if (employee.isManager) {
      console.log(`${employee.firstName} ${employee.lastName} is now a manager`);
    } else {
      console.log(`${employee.firstName} ${employee.lastName} is no longer a manager`);
    }
  } catch (error) {
    console.error('Error syncing manager status:', error);
  }
};

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
