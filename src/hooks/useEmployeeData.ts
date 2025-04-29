
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  const { 
    employees: rawEmployees = [], 
    departments: hrDepartments = [], 
    isLoading = true, 
    error 
  } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    // Make sure we have a valid array to work with
    if (!rawEmployees || !Array.isArray(rawEmployees)) {
      console.log("No employees data available or invalid data format");
      return [];
    }
    
    return rawEmployees
      .filter(employee => employee && typeof employee === 'object') // Filter out null/undefined values
      .map(employee => {
        return {
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: employee.photoURL || employee.photo || '',
          // Ensure other required fields exist
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          status: employee.status || 'active',
          department: employee.department || '',
          position: employee.position || '',
          id: employee.id || `emp-${Date.now()}`
        };
      }) as Employee[]; // Cast to Employee[] type
  }, [rawEmployees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    // Make sure we have valid arrays to work with
    if (!hrDepartments || !Array.isArray(hrDepartments)) {
      console.log("No department data available or invalid data format");
      return [];
    }
    
    return hrDepartments
      .filter(department => department && typeof department === 'object') // Filter out null values
      .map(department => {
        // Find manager if there is one
        const manager = department.managerId && formattedEmployees && formattedEmployees.length > 0
          ? formattedEmployees.find(emp => emp && emp.id === department.managerId)
          : null;
        
        // Calculate employees count safely
        const deptEmployeesCount = formattedEmployees && Array.isArray(formattedEmployees)
          ? formattedEmployees.filter(
              emp => emp && (emp.department === department.id || emp.departmentId === department.id)
            ).length
          : 0;
        
        return {
          ...department,
          managerName: manager ? `${manager.firstName} ${manager.lastName}` : null,
          employeesCount: department.employeeIds?.length || deptEmployeesCount || 0,
          // Ensure other required fields
          name: department.name || `Department ${department.id?.substring(0, 5) || ''}`,
          description: department.description || '',
          color: department.color || '#3b82f6'
        };
      }) as Department[]; // Cast to Department[] type
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
