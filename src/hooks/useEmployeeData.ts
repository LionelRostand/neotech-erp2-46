
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
    if (!employees || employees.length === 0) {
      console.log('useEmployeeData: Aucun employé disponible');
      return [];
    }
    
    console.log(`useEmployeeData: ${employees.length} employés disponibles avant traitement`);
    
    // Vérifier la présence de LIONEL DJOSSA
    const lionelPresent = employees.some(emp => 
      emp.firstName?.toLowerCase().includes('lionel') && 
      emp.lastName?.toLowerCase().includes('djossa')
    );
    
    console.log(`useEmployeeData: LIONEL DJOSSA présent dans les données brutes? ${lionelPresent}`);
    
    // Convertir tous les employés sans filtrage
    const allEmployees = employees.map(employee => ({
      ...employee,
      // Garantir que chaque employé a une photo (même placeholder)
      photoURL: employee.photoURL || employee.photo || '',
    }));
    
    console.log(`useEmployeeData: ${allEmployees.length} employés après traitement`);
    
    return allEmployees;
  }, [employees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!departments || departments.length === 0) return [];
    if (!formattedEmployees || formattedEmployees.length === 0) return departments;
    
    return departments.map(department => {
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
  }, [departments, formattedEmployees]);
  
  return {
    employees: formattedEmployees as Employee[],
    departments: formattedDepartments as Department[],
    isLoading,
    error
  };
};
