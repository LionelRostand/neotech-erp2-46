
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Department } from '@/components/module/submodules/departments/types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { subscribeToDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';
import { HierarchyNode, ChartNode } from '../types';
import { convertToChartNode } from '../utils/hierarchyUtils';

export const useHierarchyData = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  const [hierarchyData, setHierarchyData] = useState<ChartNode | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cette fonction construit la hiérarchie à partir des données des employés et des départements
  const buildHierarchy = (emps: Employee[], depts: Department[]) => {
    if (!emps || emps.length === 0) {
      console.log("Aucun employé disponible pour construire la hiérarchie");
      return null;
    }

    // Logique pour construire la hiérarchie
    // Trouver le PDG ou le niveau le plus haut
    const ceoOrTopManager = emps.find(emp => 
      emp.isManager && (!emp.managerId || emp.managerId === "none")
    );

    if (!ceoOrTopManager) {
      console.log("Aucun manager principal trouvé pour la hiérarchie");
      return null;
    }

    // Construire la hiérarchie en commençant par le haut
    const buildNode = (employee: Employee): HierarchyNode => {
      const dept = depts.find(d => d.id === employee.departmentId || d.managerId === employee.id);
      
      // Trouver tous les subordonnés directs
      const subordinates = emps.filter(emp => emp.managerId === employee.id);
      
      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        title: employee.position || employee.role || (dept ? `Manager - ${dept.name}` : "Manager"),
        manager: employee.manager || undefined,
        color: dept?.color || "#888888",
        imageUrl: employee.photoURL || employee.photo || undefined,
        children: subordinates.map(sub => buildNode(sub))
      };
    };

    const rootNode = buildNode(ceoOrTopManager);
    return convertToChartNode(rootNode);
  };

  // Effet pour construire la hiérarchie au chargement et lors des mises à jour
  useEffect(() => {
    if (!isLoading && employees && departments) {
      console.log("Construction de la hiérarchie avec", employees.length, "employés et", departments.length, "départements");
      const hierarchy = buildHierarchy(employees, departments);
      setHierarchyData(hierarchy);
    }
  }, [employees, departments, isLoading, refreshTrigger]);

  // S'abonner aux mises à jour des départements
  useEffect(() => {
    const unsubscribe = subscribeToDepartmentUpdates((updatedDepartments) => {
      console.log("Hiérarchie - Mise à jour des départements reçue:", updatedDepartments.length);
      // Déclencher un rafraîchissement de la hiérarchie
      setRefreshTrigger(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  return {
    hierarchyData,
    isLoading,
    refreshHierarchy: () => setRefreshTrigger(prev => prev + 1)
  };
};
