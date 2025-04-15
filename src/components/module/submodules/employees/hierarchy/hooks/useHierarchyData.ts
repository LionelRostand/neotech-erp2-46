
import { useState, useEffect, useCallback } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { HierarchyNode } from '../types';
import { Employee } from '@/types/employee';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { subscribeToDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';

/**
 * Hook personnalisé pour récupérer et construire les données de hiérarchie
 */
export const useHierarchyData = () => {
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null);
  const [departmentStats, setDepartmentStats] = useState({ 
    departmentsCount: 0,
    managersCount: 0 
  });
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const { employees } = useEmployeeData();
  const { departments, refetch: refetchDepartments } = useFirebaseDepartments();
  
  // Fonction pour rafraîchir la hiérarchie manuellement
  const refreshHierarchy = useCallback(() => {
    console.log("Rafraîchissement manuel de la hiérarchie");
    setRefreshCounter(prev => prev + 1);
    refetchDepartments();
  }, [refetchDepartments]);
  
  // S'abonner aux mises à jour des départements et des employés
  useEffect(() => {
    console.log("Configuration des abonnements aux mises à jour de la hiérarchie");
    
    const handleUpdates = () => {
      console.log("Mise à jour de la hiérarchie détectée");
      refreshHierarchy();
    };
    
    // S'abonner aux mises à jour
    const unsubscribe = subscribeToDepartmentUpdates(handleUpdates);
    
    // Se désabonner lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [refreshHierarchy]);
  
  // Construire la structure hiérarchique à partir des employés et des départements
  useEffect(() => {
    if (!employees || employees.length === 0) {
      console.log("Aucun employé disponible pour construire la hiérarchie");
      return;
    }
    
    console.log(`Construction de la hiérarchie avec ${employees.length} employés et ${departments?.length || 0} départements`);
    
    // Trouver le PDG ou le dirigeant principal (sans manager)
    const ceo = employees.find(emp => 
      !emp.managerId && 
      (emp.position?.toLowerCase().includes('pdg') || 
       emp.position?.toLowerCase().includes('ceo') || 
       emp.position?.toLowerCase().includes('directeur général'))
    );
    
    if (!ceo) {
      console.log("Aucun dirigeant principal trouvé dans les données");
      return;
    }
    
    // Fonction récursive pour construire l'arbre hiérarchique
    const buildHierarchyTree = (manager: Employee): HierarchyNode => {
      const subordinates = employees.filter(emp => emp.managerId === manager.id);
      
      // Trouver le département du manager
      const managerDept = departments?.find(dept => 
        dept.id === manager.departmentId || dept.id === manager.department
      );
      
      return {
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`,
        title: manager.position || manager.title || 'Employé',
        manager: manager.manager || '',
        imageUrl: manager.photoURL || manager.photo || '',
        color: managerDept?.color || '#4f46e5',
        children: subordinates.map(sub => buildHierarchyTree(sub))
      };
    };
    
    // Construire l'arbre à partir du PDG
    const hierarchyTree = buildHierarchyTree(ceo);
    setHierarchyData(hierarchyTree);
    
    // Mettre à jour les statistiques des départements
    if (departments) {
      const managersCount = employees.filter(emp => 
        emp.isManager || 
        employees.some(sub => sub.managerId === emp.id)
      ).length;
      
      setDepartmentStats({
        departmentsCount: departments.length,
        managersCount: managersCount
      });
    }
    
  }, [employees, departments, refreshCounter]);
  
  return {
    hierarchyData,
    departmentStats,
    isLoading: !hierarchyData,
    refreshHierarchy
  };
};
