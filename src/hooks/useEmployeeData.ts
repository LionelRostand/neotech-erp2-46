
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
    if (!rawEmployees || !Array.isArray(rawEmployees) || rawEmployees.length === 0) {
      console.log("No employees data available or invalid data format");
      return [];
    }
    
    return rawEmployees.map(employee => {
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
        status: employee.status || 'active',
        department: employee.department || '',
        position: employee.position || '',
        id: employee.id || `emp-${Date.now()}`
      };
    }).filter(Boolean) as Employee[]; // Filter out null values
  }, [rawEmployees]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!hrDepartments || !Array.isArray(hrDepartments) || hrDepartments.length === 0) {
      console.log("No department data available or invalid data format");
      return [];
    }
    
    if (!formattedEmployees || formattedEmployees.length === 0) {
      console.log("Using departments without employee data");
      return hrDepartments;
    }
    
    return hrDepartments.map(department => {
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
    }).filter(Boolean) as Department[]; // Filter out null values
  }, [hrDepartments, formattedEmployees]);
  
  return {
    employees: formattedEmployees,
    departments: formattedDepartments,
    isLoading,
    error
  };
};
