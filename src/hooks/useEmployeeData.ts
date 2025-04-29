
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  const { employees: rawEmployees, departments: hrDepartments, isLoading, error } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    if (!rawEmployees || !Array.isArray(rawEmployees) || rawEmployees.length === 0) return [];
    
    return rawEmployees.map(employee => ({
      ...employee,
      // Garantir que chaque employé a une photo (même placeholder)
      photoURL: employee.photoURL || employee.photo || '',
    }));
  }, [rawEmployees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!hrDepartments || !Array.isArray(hrDepartments) || hrDepartments.length === 0) return [];
    if (!formattedEmployees || formattedEmployees.length === 0) return hrDepartments || [];
    
    return hrDepartments.map(department => {
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
        employeesCount: department.employeeIds?.length || deptEmployeesCount || 0
      } as Department;
    });
  }, [hrDepartments, formattedEmployees]);
  
  return {
    employees: formattedEmployees as Employee[],
    departments: formattedDepartments as Department[],
    isLoading,
    error,
    // Expose a refetch function if needed in the future
    refetchData: () => console.log('Refetching employee data...')
  };
};
