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
        
        // Prioritizing photoData if it exists
        if (employee.photoData && typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
          photoURL = employee.photoData;
          console.log(`Found photoData for ${employee.firstName} ${employee.lastName}`);
        } 
        // Then check for photoURL
        else if (employee.photoURL && typeof employee.photoURL === 'string' && employee.photoURL.length > 0) {
          photoURL = employee.photoURL;
          console.log(`Found photoURL for ${employee.firstName} ${employee.lastName}`);
        }
        // Finally check for photo
        else if (employee.photo && typeof employee.photo === 'string' && employee.photo.length > 0) {
          photoURL = employee.photo;
          console.log(`Found photo for ${employee.firstName} ${employee.lastName}`);
        }
        
        // If photoData is an object, try to extract data property
        if (!photoURL && employee.photoData && typeof employee.photoData === 'object' && 
                employee.photoData !== null) {
          // Use Record<string, unknown> for better type safety
          const photoDataObj = employee.photoData as Record<string, unknown>;
          if ('data' in photoDataObj && typeof photoDataObj.data === 'string') {
            photoURL = photoDataObj.data;
            console.log(`Found photoData.data for ${employee.firstName} ${employee.lastName}`);
          }
        }

        uniqueEmployeesMap.set(employee.email, {
          ...employee,
          photoURL: photoURL,
          photo: photoURL, // Dupliquer pour compatibilité
          photoData: photoURL || employee.photoData, // Ensure photoData is set
        });
      }
    });
    
    const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
    
    console.log(`useEmployeeData: ${uniqueEmployees.length} employés après traitement`);
    
    // Log some debugging information
    if (uniqueEmployees.length > 0) {
      const firstEmployee = uniqueEmployees[0];
      console.log(`Premier employé après traitement: ${firstEmployee.firstName} ${firstEmployee.lastName}`);
      console.log(`  - photoURL: ${firstEmployee.photoURL ? 'Présent' : 'Absent'}`);
      console.log(`  - photo: ${firstEmployee.photo ? 'Présent' : 'Absent'}`);
      console.log(`  - photoData: ${firstEmployee.photoData ? 'Présent' : 'Absent'}`);
    }
    
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
