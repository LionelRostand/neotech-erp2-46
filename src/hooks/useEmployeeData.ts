
import { useHrModuleData } from './useHrModuleData';
import { useMemo } from 'react';

/**
 * Hook pour accéder facilement aux données des employés
 * Ce hook est un wrapper autour de useHrModuleData qui facilite
 * l'accès aux données spécifiques des employés
 */
export const useEmployeeData = () => {
  const { 
    employees,
    departments,
    contracts,
    badges,
    isLoading,
    error
  } = useHrModuleData();
  
  // Traitement pour enrichir les données des employés avec leurs départements
  const enrichedEmployees = useMemo(() => {
    if (!employees || !departments) return employees || [];
    
    return employees.map(employee => {
      // Rechercher le département de l'employé
      if (employee.departmentId) {
        const department = departments.find(d => d.id === employee.departmentId);
        if (department) {
          return {
            ...employee,
            department: department.name,
            departmentColor: department.color
          };
        }
      }
      return employee;
    });
  }, [employees, departments]);
  
  // Obtenir le nombre d'employés par département
  const employeesByDepartment = useMemo(() => {
    const result: Record<string, number> = {};
    
    if (employees && departments) {
      // Initialiser tous les départements à 0
      departments.forEach(dept => {
        result[dept.id] = 0;
      });
      
      // Compter les employés par département
      employees.forEach(employee => {
        if (employee.departmentId && result[employee.departmentId] !== undefined) {
          result[employee.departmentId]++;
        }
      });
    }
    
    return result;
  }, [employees, departments]);
  
  return {
    employees: enrichedEmployees,
    rawEmployees: employees || [],
    departments: departments || [],
    contracts: contracts || [],
    badges: badges || [],
    employeesByDepartment,
    isLoading,
    error
  };
};
