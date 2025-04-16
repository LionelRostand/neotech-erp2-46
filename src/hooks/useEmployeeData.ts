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
    const departmentsMap = departments?.reduce((acc, dept) => {
      acc.set(dept.id, dept.name);
      return acc;
    }, new Map<string, string>()) || new Map();
    
    employees.forEach(employee => {
      const existingEmployee = uniqueEmployeesMap.get(employee.email);
      
      if (!existingEmployee || (employee.firebaseId && !existingEmployee.firebaseId)) {
        let photoURL = '';
        
        if (employee.photoData) {
          if (typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
            photoURL = employee.photoData;
          } else if (typeof employee.photoData === 'object' && 
                    employee.photoData !== null) {
            const photoDataObj = employee.photoData as Record<string, unknown>;
            if ('data' in photoDataObj && typeof photoDataObj.data === 'string') {
              photoURL = photoDataObj.data;
            }
          }
        }
        
        photoURL = photoURL || employee.photoURL || employee.photo || '';
        
        let departmentName = employee.department;
        if (typeof employee.department === 'string' && departmentsMap.has(employee.department)) {
          departmentName = departmentsMap.get(employee.department) || employee.department;
        } else if (employee.departmentId && departmentsMap.has(employee.departmentId)) {
          departmentName = departmentsMap.get(employee.departmentId) || employee.department;
        }

        uniqueEmployeesMap.set(employee.email, {
          ...employee,
          photoURL: photoURL,
          photo: photoURL,
          department: departmentName,
        });
      }
    });
    
    const uniqueEmployees = Array.from(uniqueEmployeesMap.values());
    
    console.log(`useEmployeeData: ${uniqueEmployees.length} employés après traitement`);
    
    return uniqueEmployees;
  }, [employees, departments]);
  
  // Formater les départements pour les enrichir avec les données des managers
  const formattedDepartments = useMemo(() => {
    if (!departments || departments.length === 0) return [];
    if (!formattedEmployees || formattedEmployees.length === 0) return departments;
    
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
