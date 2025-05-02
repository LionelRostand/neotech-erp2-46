
import { useMemo, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook centralisé pour accéder aux données des employés et départements
 * Avec optimisation pour réduire les requêtes Firebase
 */
export const useEmployeeData = () => {
  const { employees: rawEmployees = [], departments: hrDepartments = [], isLoading = true, error } = useHrModuleData();
  
  // Fonction pour obtenir le nom d'un département à partir de son ID
  const getDepartmentNameById = useCallback((departmentId: string): string => {
    if (!departmentId || !Array.isArray(hrDepartments)) return 'Non spécifié';
    
    const department = hrDepartments.find(dept => dept && dept.id === departmentId);
    return department?.name || 'Non spécifié';
  }, [hrDepartments]);
  
  // On s'assure que les données des employés sont correctement formatées
  const formattedEmployees = useMemo(() => {
    // Make sure rawEmployees is a valid array
    if (!Array.isArray(rawEmployees)) {
      console.log('useEmployeeData: rawEmployees is not a valid array');
      return [];
    }
    
    return rawEmployees
      .filter(employee => employee != null) // Filter out null/undefined employees
      .map(employee => {
        if (!employee) return null; // Extra safety check
        
        // Get department name from id
        const departmentId = employee.departmentId || employee.department;
        const departmentName = typeof departmentId === 'string' ? 
          getDepartmentNameById(departmentId) : 
          (typeof employee.department === 'string' ? employee.department : 'Non spécifié');
        
        return {
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: employee.photoURL || employee.photo || '',
          // Make sure department name is properly set
          departmentId: departmentId,
          department: departmentName
        };
      })
      .filter(Boolean); // Filter out any nulls that might have resulted from the mapping
  }, [rawEmployees, getDepartmentNameById]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    // Make sure hrDepartments is a valid array
    if (!Array.isArray(hrDepartments)) {
      console.log('useEmployeeData: hrDepartments is not a valid array');
      return [];
    }
    
    // Check if formattedEmployees exists and is an array
    const safeEmployees = Array.isArray(formattedEmployees) ? formattedEmployees : [];
    
    return hrDepartments
      .filter(department => department != null) // Filter out null/undefined departments
      .map(department => {
        // Make sure department has an id
        if (!department || !department.id) {
          console.log('useEmployeeData: department without id');
          return {
            id: `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: 'Unknown Department',
            managerName: null,
            employeesCount: 0
          };
        }
        
        const manager = department.managerId 
          ? safeEmployees.find(emp => emp && emp.id === department.managerId) 
          : null;
        
        // Calculate employees count safely
        const deptEmployeesCount = safeEmployees.filter(
          emp => emp && (
            (emp.department === department.name) || 
            (emp.departmentId === department.id)
          )
        ).length;
        
        // Safely access employeeIds array
        const employeeIds = department.employeeIds && Array.isArray(department.employeeIds) 
          ? department.employeeIds 
          : [];
        
        return {
          ...department,
          managerName: manager ? `${manager.firstName || ''} ${manager.lastName || ''}`.trim() || null : null,
          employeesCount: employeeIds.length || deptEmployeesCount || 0
        } as Department;
      });
  }, [hrDepartments, formattedEmployees]);
  
  return {
    employees: formattedEmployees as Employee[],
    departments: formattedDepartments as Department[],
    isLoading,
    error,
    getDepartmentNameById
  };
};
