
import { useState, useEffect, useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 * Avec optimisation pour réduire les requêtes Firebase
 */
export const useEmployeeData = () => {
  const { employees: rawEmployees, departments: hrDepartments, isLoading, error } = useHrModuleData();
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    // Make sure rawEmployees is a valid array
    if (!rawEmployees || !Array.isArray(rawEmployees) || rawEmployees.length === 0) {
      return [];
    }
    
    return rawEmployees.map(employee => ({
      ...employee,
      // Garantir que chaque employé a une photo (même placeholder)
      photoURL: employee.photoURL || employee.photo || '',
    }));
  }, [rawEmployees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    // Make sure hrDepartments is a valid array
    if (!hrDepartments || !Array.isArray(hrDepartments) || hrDepartments.length === 0) {
      return [];
    }
    
    // Make sure formattedEmployees is a valid array
    if (!formattedEmployees || !Array.isArray(formattedEmployees) || formattedEmployees.length === 0) {
      return hrDepartments;
    }
    
    return hrDepartments.map(department => {
      // Make sure department has an id and isn't null/undefined
      if (!department || !department.id) {
        return {
          id: `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Unknown Department',
          managerName: null,
          employeesCount: 0
        };
      }
      
      const manager = department.managerId 
        ? formattedEmployees.find(emp => emp && emp.id === department.managerId) 
        : null;
      
      // Calculer le nombre d'employés dans ce département (safely)
      const deptEmployeesCount = formattedEmployees.filter(
        emp => emp && (emp.department === department.id || emp.departmentId === department.id)
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
    error
    // Removed refetch function to prevent unnecessary polling
  };
};
