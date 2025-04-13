
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
    
    console.log(`useEmployeeData: ${employees.length} employés disponibles avant traitement`);
    
    // Créer une Map pour éliminer les doublons par ID
    const uniqueEmployeesMap = new Map();
    
    employees.forEach(employee => {
      // Privilégier les enregistrements avec un firebaseId
      const existingEmployee = uniqueEmployeesMap.get(employee.email);
      
      // Si l'employé n'existe pas encore dans la Map, ou si le nouvel employé a un firebaseId, l'ajouter/remplacer
      if (!existingEmployee || (employee.firebaseId && !existingEmployee.firebaseId)) {
        // Déterminer quelle URL de photo utiliser (par ordre de priorité)
        let photoURL = '';
        
        // 1. Si photoData est une chaîne base64, l'utiliser
        if (employee.photoData && typeof employee.photoData === 'string' && employee.photoData.startsWith('data:')) {
          photoURL = employee.photoData;
        } 
        // 2. Si photoData est un objet avec une propriété data
        else if (employee.photoData && typeof employee.photoData === 'object' && employee.photoData.data) {
          photoURL = employee.photoData.data;
        }
        // 3. Utiliser photoURL existant
        else if (employee.photoURL && employee.photoURL.length > 0) {
          photoURL = employee.photoURL;
        }
        // 4. Utiliser l'ancienne propriété photo
        else if (employee.photo && employee.photo.length > 0) {
          photoURL = employee.photo;
        }

        uniqueEmployeesMap.set(employee.email, {
          ...employee,
          // Garantir que chaque employé a une photo (même placeholder)
          photoURL: photoURL,
          photo: photoURL, // Dupliquer pour compatibilité
        });
      }
    });
    
    // Convertir la Map en tableau
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
    departments: formattedDepartments as Department[],
    isLoading,
    error
  };
};
