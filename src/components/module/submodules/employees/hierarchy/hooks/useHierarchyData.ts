
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
    let ceoOrTopManager = emps.find(emp => 
      emp.isManager && (!emp.managerId || emp.managerId === "none")
    );

    // Si aucun top manager n'est trouvé, utiliser le premier employé avec isManager=true
    if (!ceoOrTopManager) {
      ceoOrTopManager = emps.find(emp => emp.isManager === true);
    }

    // Si toujours aucun manager n'est trouvé, prendre le premier employé de la liste
    if (!ceoOrTopManager && emps.length > 0) {
      console.log("Aucun manager trouvé, utilisation du premier employé comme racine");
      ceoOrTopManager = emps[0];
    }

    if (!ceoOrTopManager) {
      console.log("Impossible de construire la hiérarchie - aucun employé disponible");
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
    if (!isLoading) {
      // Utiliser les données des employés et des départements disponibles
      const emps = employees || [];
      const depts = departments || [];
      
      console.log("Construction de la hiérarchie avec", emps.length, "employés et", depts.length, "départements");
      
      try {
        const hierarchy = buildHierarchy(emps, depts);
        setHierarchyData(hierarchy);
        
        if (!hierarchy && emps.length > 0) {
          // Si aucune hiérarchie n'a pu être construite mais qu'il y a des employés,
          // créer une hiérarchie de secours avec un seul niveau pour l'affichage
          console.log("Création d'une hiérarchie de secours pour l'affichage");
          const fallbackNode: ChartNode = {
            id: "root",
            name: "Organisation",
            position: "Tous les employés",
            children: emps.map(emp => ({
              id: emp.id,
              name: `${emp.firstName} ${emp.lastName}`,
              position: emp.position || emp.role || "Employé",
              department: emp.department || undefined,
              departmentColor: "#888888",
              imageUrl: emp.photoURL || emp.photo || undefined,
              children: []
            }))
          };
          setHierarchyData(fallbackNode);
        }
      } catch (error) {
        console.error("Erreur lors de la construction de la hiérarchie:", error);
      }
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
