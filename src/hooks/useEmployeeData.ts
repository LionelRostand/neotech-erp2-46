
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  const { employees, departments, isLoading, error } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées et dédupliquées
  const formattedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) {
      console.log('useEmployeeData: Aucun employé disponible');
      return [];
    }
    
    console.log(`useEmployeeData: ${employees.length} employés disponibles avant traitement et déduplication`);
    
    // Créer une Map pour éliminer les doublons par ID
    const uniqueEmployeesMap = new Map();
    
    employees.forEach(employee => {
      // Si l'employé n'existe pas encore dans la Map, l'ajouter
      if (!uniqueEmployeesMap.has(employee.id)) {
        uniqueEmployeesMap.set(employee.id, {
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: employee.photoURL || employee.photo || '',
        });
      }
    });
    
    // Convertir la Map en tableau
    const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
    
    console.log(`useEmployeeData: ${uniqueEmployees.length} employés après déduplication et traitement`);
    
    // Vérifier la présence de LIONEL DJOSSA
    const lionelPresent = uniqueEmployees.some(emp => 
      emp.firstName?.toLowerCase().includes('lionel') && 
      emp.lastName?.toLowerCase().includes('djossa')
    );
    
    console.log(`useEmployeeData: LIONEL DJOSSA présent dans les données après déduplication? ${lionelPresent}`);
    
    return uniqueEmployees;
  }, [employees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!departments || departments.length === 0) return [];
    if (!formattedEmployees || formattedEmployees.length === 0) return departments;
    
    // Éliminer les doublons de départements par ID
    const uniqueDepartmentsMap = new Map();
    departments.forEach(dept => {
      if (!uniqueDepartmentsMap.has(dept.id)) {
        uniqueDepartmentsMap.set(dept.id, dept);
      }
    });
    
    const uniqueDepartments = Array.from(uniqueDepartmentsMap.values());
    
    return uniqueDepartments.map(department => {
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
