
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  const { employees, departments, isLoading, error } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees) || employees.length === 0) return [];
    
    return employees
      .filter(Boolean) // Filter out null/undefined
      .map(employee => ({
        ...employee,
        // Garantir que chaque employé a une photo (même placeholder)
        photoURL: employee.photoURL || employee.photo || '',
      }));
  }, [employees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!departments || !Array.isArray(departments) || departments.length === 0) return [];
    if (!formattedEmployees || !Array.isArray(formattedEmployees) || formattedEmployees.length === 0) return [];
    
    return departments
      .filter(Boolean) // Filter out null/undefined
      .map(department => {
        // Verify department is valid before processing
        if (!department) return null;
        
        const manager = department.managerId 
          ? formattedEmployees.find(emp => emp && emp.id === department.managerId) 
          : null;
        
        // Calculer le nombre d'employés dans ce département
        const deptEmployeesCount = formattedEmployees.filter(
          emp => emp && (emp.department === department.id || emp.departmentId === department.id)
        ).length;
        
        return {
          ...department,
          managerName: manager ? `${manager.firstName} ${manager.lastName}` : null,
          employeesCount: department.employeeIds?.length || deptEmployeesCount || 0
        } as Department;
      })
      .filter(Boolean); // Filter out any null results
  }, [departments, formattedEmployees]);
  
  return {
    employees: formattedEmployees as Employee[],
    departments: formattedDepartments as Department[],
    isLoading,
    error
  };
};
