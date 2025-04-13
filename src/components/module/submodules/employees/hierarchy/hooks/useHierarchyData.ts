
import { useState, useEffect, useCallback } from 'react';
import { HierarchyNode } from '../types';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { subscribeToDepartmentUpdates } from '../../../departments/utils/departmentUtils';
import { toast } from 'sonner';

/**
 * Hook pour récupérer et gérer les données de hiérarchie
 */
export const useHierarchyData = () => {
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { employees, departments } = useHrModuleData();

  // Fonction pour construire la hiérarchie
  const buildHierarchy = useCallback(() => {
    if (!employees || employees.length === 0) {
      console.log("Aucun employé trouvé pour construire la hiérarchie");
      setHierarchyData(null);
      setIsLoading(false);
      return;
    }

    console.log(`Construction de la hiérarchie avec ${employees.length} employés et ${departments?.length || 0} départements`);
    
    // Identifier les managers et leur créer des nœuds
    const managersMap = new Map<string, HierarchyNode>();
    const employeesWithManager = new Set<string>();
    
    // Étape 1: Créer un nœud pour chaque employé avec un ID managerId
    employees.forEach(employee => {
      if (employee.id) {
        const node: HierarchyNode = {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          title: employee.position || employee.title || employee.role || 'Employé',
          manager: '',
          children: [],
          imageUrl: employee.photoURL || '',
          color: ''
        };
        
        // Si c'est un manager, l'ajouter à la map des managers
        managersMap.set(employee.id, node);
        
        // Si l'employé a un manager, l'ajouter à l'ensemble des employés avec manager
        if (employee.managerId) {
          employeesWithManager.add(employee.id);
        }
      }
    });
    
    // Étape 2: Établir les relations hiérarchiques
    employees.forEach(employee => {
      if (employee.managerId && managersMap.has(employee.managerId) && managersMap.has(employee.id)) {
        const managerNode = managersMap.get(employee.managerId);
        const employeeNode = managersMap.get(employee.id);
        
        if (managerNode && employeeNode) {
          // Ajouter l'employé comme enfant du manager
          managerNode.children.push(employeeNode);
          
          // Définir le nom du manager pour l'employé
          const manager = employees.find(emp => emp.id === employee.managerId);
          if (manager) {
            employeeNode.manager = `${manager.firstName} ${manager.lastName}`;
          }
        }
      }
    });
    
    // Étape 3: Identifier le nœud racine (PDG ou manager principal)
    // On cherche d'abord un employé avec le titre "PDG", "CEO", "Directeur Général", etc.
    let rootNode: HierarchyNode | null = null;
    
    for (const employee of employees) {
      const position = (employee.position || employee.title || employee.role || '').toLowerCase();
      if (
        position.includes('pdg') || 
        position.includes('ceo') || 
        position.includes('directeur général') || 
        position.includes('directeur general') ||
        position.includes('président') ||
        position.includes('president')
      ) {
        rootNode = managersMap.get(employee.id) || null;
        break;
      }
    }
    
    // Si aucun PDG n'est trouvé, chercher un manager qui n'a pas de manager lui-même
    if (!rootNode) {
      for (const [empId, node] of managersMap.entries()) {
        const employee = employees.find(emp => emp.id === empId);
        if (employee && !employee.managerId && !employeesWithManager.has(empId)) {
          // Vérifier si ce manager a des subordonnés
          if (node.children.length > 0) {
            rootNode = node;
            break;
          }
        }
      }
    }
    
    // S'il n'y a toujours pas de racine mais que des managers existent, prendre le premier manager
    if (!rootNode && managersMap.size > 0) {
      for (const node of managersMap.values()) {
        if (node.children.length > 0) {
          rootNode = node;
          break;
        }
      }
    }
    
    // Si aucun manager avec subordonnés n'est trouvé, prendre le premier employé comme racine
    if (!rootNode && employees.length > 0 && managersMap.size > 0) {
      rootNode = managersMap.values().next().value;
    }
    
    // Enrichir les nœuds avec les couleurs de département
    if (departments && departments.length > 0) {
      employees.forEach(employee => {
        if (employee.departmentId && managersMap.has(employee.id)) {
          const node = managersMap.get(employee.id);
          if (node) {
            const department = departments.find(dept => dept.id === employee.departmentId);
            if (department) {
              node.color = department.color || '';
            }
          }
        }
      });
    }

    // Définir les données de hiérarchie
    setHierarchyData(rootNode);
    setIsLoading(false);
  }, [employees, departments]);

  // Construire la hiérarchie au chargement des données
  useEffect(() => {
    buildHierarchy();
  }, [buildHierarchy]);

  // Écouter les mises à jour des départements
  useEffect(() => {
    const handleDepartmentsUpdate = () => {
      console.log("Mise à jour des départements détectée, reconstruction de la hiérarchie");
      buildHierarchy();
    };
    
    const unsubscribe = subscribeToDepartmentUpdates(handleDepartmentsUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [buildHierarchy]);

  // Fonction pour rafraîchir manuellement la hiérarchie
  const refreshHierarchy = useCallback(() => {
    setIsLoading(true);
    console.log("Rafraîchissement manuel de la hiérarchie");
    
    // Petit délai pour montrer visuellement le chargement
    setTimeout(() => {
      buildHierarchy();
      toast.success("Hiérarchie actualisée");
    }, 300);
  }, [buildHierarchy]);

  return {
    hierarchyData,
    isLoading,
    refreshHierarchy
  };
};
