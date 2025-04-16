
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';

export const useEmployeeData = () => {
  const { employees, departments, isLoading, error } = useHrModuleData();
  
  const formattedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) {
      console.log('useEmployeeData: Aucun employé disponible');
      return [];
    }
    
    console.log(`useEmployeeData: ${employees.length} employés disponibles avant traitement`);
    
    const uniqueEmployeesMap = new Map();
    
    employees.forEach(employee => {
      const existingEmployee = uniqueEmployeesMap.get(employee.email);
      
      if (!existingEmployee || (employee.firebaseId && !existingEmployee.firebaseId)) {
        let photoURL = '';
        
        // Null-safe checks for photoData with additional type guards
        if (employee.photoData) {
          if (typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
            photoURL = employee.photoData;
          } else if (typeof employee.photoData === 'object' && 
                    employee.photoData !== null) {
            // Use Record<string, unknown> for better type safety
            const photoDataObj = employee.photoData as Record<string, unknown>;
            if ('data' in photoDataObj && typeof photoDataObj.data === 'string') {
              photoURL = photoDataObj.data;
            }
          }
        }
        
        // Fallback to other photo sources
        photoURL = photoURL || employee.photoURL || employee.photo || '';

        uniqueEmployeesMap.set(employee.email, {
          ...employee,
          photoURL: photoURL,
          photo: photoURL, // Dupliquer pour compatibilité
        });
      }
    });
    
    const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
    
    console.log(`useEmployeeData: ${uniqueEmployees.length} employés après traitement`);
    
    // Vérifier la présence de LIONEL DJOSSA
    const lionelPresent = uniqueEmployees.some(emp => 
      emp.firstName?.toLowerCase().includes('lionel') && 
      emp.lastName?.toLowerCase().includes('djossa')
    );
    
    console.log(`useEmployeeData: LIONEL DJOSSA présent dans les données après traitement? ${lionelPresent}`);
    console.log('Premier employé après traitement:', uniqueEmployees[0]?.photoURL ? 'a une photo' : 'sans photo');
    
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
    departments,
    isLoading,
    error
  };
};
