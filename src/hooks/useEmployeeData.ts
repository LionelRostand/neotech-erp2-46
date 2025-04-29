
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  // Always destructure with default values to ensure consistent structure
  const { 
    employees: rawEmployees = [], 
    departments: hrDepartments = [], 
    isLoading = true, 
    error = null 
  } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    if (!rawEmployees || !Array.isArray(rawEmployees)) {
      console.log("No employees data available or invalid data format");
      return [];
    }
    
    return rawEmployees
      .filter(employee => employee !== null && employee !== undefined)
      .map(employee => {
        // Make sure employee is a valid object
        if (!employee || typeof employee !== 'object') {
          console.warn("Invalid employee data:", employee);
          return null;
        }
        
        return {
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: employee.photoURL || employee.photo || '',
          // Ensure other required fields exist
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          professionalEmail: employee.professionalEmail || employee.email || '',
          status: employee.status || 'active',
          department: employee.department || '',
          position: employee.position || '',
          id: employee.id || `emp-${Date.now()}`
        };
      })
      .filter(Boolean) as Employee[]; // Filter out null values
  }, [rawEmployees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!hrDepartments || !Array.isArray(hrDepartments)) {
      console.log("No department data available or invalid data format");
      return [];
    }
    
    // Handle case where employees data is not available yet
    if (!formattedEmployees || !Array.isArray(formattedEmployees)) {
      console.log("Using departments without employee data");
      return hrDepartments.map(dept => {
        if (!dept) return null;
        return {
          ...dept,
          name: dept.name || `Department ${dept.id?.substring(0, 5) || ''}`,
          description: dept.description || '',
          color: dept.color || '#3b82f6'
        };
      }).filter(Boolean) as Department[];
    }
    
    return hrDepartments
      .filter(department => department !== null && department !== undefined)
      .map(department => {
        // Make sure department is a valid object
        if (!department || typeof department !== 'object') {
          console.warn("Invalid department data:", department);
          return null;
        }
        
        const manager = department.managerId 
          ? formattedEmployees.find(emp => emp.id === department.managerId) 
          : null;
        
        // Calculer le nombre d'employés dans ce département
        const deptEmployeesCount = formattedEmployees.filter(
          emp => emp.department === department.id || emp.departmentId === department.id
        ).length;
        
        return {
          ...department,
          managerName: manager ? `${manager.firstName} ${manager.lastName}` : null,
          employeesCount: department.employeeIds?.length || deptEmployeesCount || 0,
          // Ensure other required fields
          name: department.name || `Department ${department.id?.substring(0, 5) || ''}`,
          description: department.description || '',
          color: department.color || '#3b82f6'
        };
      })
      .filter(Boolean) as Department[]; // Filter out null values
  }, [hrDepartments, formattedEmployees]);
  
  return {
    employees: formattedEmployees || [],
    departments: formattedDepartments || [],
    isLoading,
    error,
    // Expose a refetch function if needed in the future
    refetchData: () => console.log('Refetching employee data...')
  };
};
