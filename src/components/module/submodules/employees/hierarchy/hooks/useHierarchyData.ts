
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

    // Convertir les IDs des managers en références d'employés
    const employeesMap = new Map<string, Employee>();
    emps.forEach(emp => employeesMap.set(emp.id, emp));

    // Trouver tous les managers dans les départements
    const departmentManagers = new Set<string>();
    depts.forEach(dept => {
      if (dept.managerId) {
        departmentManagers.add(dept.managerId);
      }
    });

    // Vérifier explicitement quels employés sont des managers (ont des subordonnés)
    const hasSubordinates = new Map<string, boolean>();
    emps.forEach(emp => {
      if (emp.managerId && employeesMap.has(emp.managerId)) {
        hasSubordinates.set(emp.managerId, true);
      }
    });

    // Logique pour construire la hiérarchie
    // 1. Chercher d'abord un PDG ou top manager explicite
    let ceoOrTopManager = emps.find(emp => 
      (emp.isManager === true || emp.position?.toLowerCase().includes('pdg') || 
       emp.position?.toLowerCase().includes('ceo') || emp.position?.toLowerCase().includes('directeur')) && 
      (!emp.managerId || emp.managerId === "none")
    );

    // 2. Si aucun top manager n'est trouvé, chercher un manager de département
    if (!ceoOrTopManager) {
      ceoOrTopManager = emps.find(emp => departmentManagers.has(emp.id));
    }

    // 3. Chercher n'importe quel employé qui a des subordonnés
    if (!ceoOrTopManager) {
      ceoOrTopManager = emps.find(emp => hasSubordinates.get(emp.id) === true);
    }

    // 4. Dernier recours: utiliser le premier employé de la liste qui semble être un manager
    if (!ceoOrTopManager) {
      ceoOrTopManager = emps.find(emp => 
        emp.isManager === true || 
        (emp.position && (
          emp.position.toLowerCase().includes('manager') || 
          emp.position.toLowerCase().includes('responsable') || 
          emp.position.toLowerCase().includes('chef')
        ))
      );
    }

    // 5. Si toujours aucun manager, prendre le premier employé
    if (!ceoOrTopManager && emps.length > 0) {
      console.log("Aucun manager trouvé, utilisation du premier employé comme racine");
      ceoOrTopManager = emps[0];
    }

    if (!ceoOrTopManager) {
      console.log("Impossible de construire la hiérarchie - aucun employé disponible");
      return null;
    }

    // Construire la hiérarchie en commençant par le haut
    const buildNode = (employee: Employee, processedEmployees = new Set<string>()): HierarchyNode => {
      // Éviter les boucles infinies en cas de relations cycliques
      if (processedEmployees.has(employee.id)) {
        return {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          title: employee.position || employee.role || "Employé",
          manager: undefined,
          color: "#888888",
          children: []
        };
      }
      
      processedEmployees.add(employee.id);
      
      // Trouver le département de l'employé
      const dept = depts.find(d => d.id === employee.departmentId || d.managerId === employee.id);
      const deptColor = dept?.color || "#888888";
      
      // Trouver le nom du manager
      let managerName = undefined;
      if (employee.managerId && employee.managerId !== "none") {
        const manager = employeesMap.get(employee.managerId);
        if (manager) {
          managerName = `${manager.firstName} ${manager.lastName}`;
        }
      }
      
      // Trouver tous les subordonnés directs
      const subordinates = emps.filter(emp => emp.managerId === employee.id);
      
      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        title: employee.position || employee.role || (dept ? `Manager - ${dept.name}` : "Employé"),
        manager: managerName,
        color: deptColor,
        imageUrl: employee.photoURL || employee.photo || undefined,
        children: subordinates.map(sub => buildNode(sub, new Set(processedEmployees)))
      };
    };

    const rootNode = buildNode(ceoOrTopManager, new Set<string>());
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
          
          // Regrouper les employés par département
          const departmentMap = new Map<string, Employee[]>();
          
          emps.forEach(emp => {
            const deptId = emp.departmentId || 'sans-departement';
            if (!departmentMap.has(deptId)) {
              departmentMap.set(deptId, []);
            }
            departmentMap.get(deptId)?.push(emp);
          });
          
          // Créer une structure hiérarchique basée sur les départements
          const fallbackChildren: ChartNode[] = [];
          
          // D'abord ajouter les départements avec managers
          depts.forEach(dept => {
            if (dept.managerId) {
              const manager = emps.find(emp => emp.id === dept.managerId);
              if (manager) {
                const deptEmployees = departmentMap.get(dept.id) || [];
                // Filtrer le manager de la liste des employés du département
                const deptMembers = deptEmployees.filter(emp => emp.id !== manager.id);
                
                fallbackChildren.push({
                  id: manager.id,
                  name: `${manager.firstName} ${manager.lastName}`,
                  position: manager.position || `Manager - ${dept.name}`,
                  department: dept.name,
                  departmentColor: dept.color || "#888888",
                  imageUrl: manager.photoURL || manager.photo || undefined,
                  children: deptMembers.map(emp => ({
                    id: emp.id,
                    name: `${emp.firstName} ${emp.lastName}`,
                    position: emp.position || emp.role || "Employé",
                    department: dept.name,
                    departmentColor: dept.color || "#888888",
                    imageUrl: emp.photoURL || emp.photo || undefined,
                    children: []
                  }))
                });
                
                // Supprimer ce département de la map pour éviter les doublons
                departmentMap.delete(dept.id);
              }
            }
          });
          
          // Ensuite ajouter les départements restants sans managers assignés
          departmentMap.forEach((empList, deptId) => {
            if (empList.length > 0) {
              const dept = depts.find(d => d.id === deptId);
              const deptName = dept?.name || "Département non spécifié";
              const deptColor = dept?.color || "#888888";
              
              fallbackChildren.push({
                id: `dept-${deptId}`,
                name: deptName,
                position: "Département",
                departmentColor: deptColor,
                children: empList.map(emp => ({
                  id: emp.id,
                  name: `${emp.firstName} ${emp.lastName}`,
                  position: emp.position || emp.role || "Employé",
                  department: deptName,
                  departmentColor: deptColor,
                  imageUrl: emp.photoURL || emp.photo || undefined,
                  children: []
                }))
              });
            }
          });
          
          const fallbackNode: ChartNode = {
            id: "root",
            name: "Organisation",
            position: "Tous les départements",
            children: fallbackChildren
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
