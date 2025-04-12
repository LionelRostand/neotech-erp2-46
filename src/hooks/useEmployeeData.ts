
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';
import { toast } from 'sonner';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 */
export const useEmployeeData = () => {
  const { employees, departments, isLoading, error } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées et dédupliquées
  const formattedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    // Filtrer pour n'avoir que des employés uniques par ID, email et nom complet
    const uniqueEmployees = [];
    const seenIds = new Set();
    const seenEmails = new Set();
    const seenFullNames = new Set();
    
    console.log(`Total d'employés avant déduplication: ${employees.length}`);
    
    for (const employee of employees) {
      const fullName = `${employee.firstName || ''}${employee.lastName || ''}`.toLowerCase().trim();
      const email = (employee.email || employee.professionalEmail || '').toLowerCase().trim();
      const employeeId = employee.id;
      
      // Vérifier si l'employé est un doublon
      if (!seenIds.has(employeeId) && 
          (!email || !seenEmails.has(email)) && 
          (!fullName || !seenFullNames.has(fullName))) {
        
        seenIds.add(employeeId);
        if (email) seenEmails.add(email);
        if (fullName) seenFullNames.add(fullName);
        
        uniqueEmployees.push({
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: employee.photoURL || employee.photo || '',
        });
      } else {
        // Pour le debug, afficher les doublons identifiés
        console.log(`Doublon identifié et filtré: ${employee.firstName} ${employee.lastName} (${employee.id})`);
      }
    }
    
    console.log(`Total d'employés après déduplication: ${uniqueEmployees.length}`);
    
    if (employees.length !== uniqueEmployees.length) {
      toast.info(`${employees.length - uniqueEmployees.length} doublons d'employés ont été filtrés`);
    }
    
    return uniqueEmployees;
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
