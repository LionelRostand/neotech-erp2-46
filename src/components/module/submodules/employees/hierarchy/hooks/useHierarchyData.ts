
import { useState, useEffect, useCallback } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { HierarchyNode } from '../types';
import { Employee } from '@/types/employee';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { subscribeToDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

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
  const [isCreatingCEO, setIsCreatingCEO] = useState(false);
  
  const { employees, refetchEmployees } = useEmployeeData();
  const { departments, refetch: refetchDepartments } = useFirebaseDepartments();
  
  // Fonction pour rafraîchir la hiérarchie manuellement
  const refreshHierarchy = useCallback(() => {
    console.log("Rafraîchissement manuel de la hiérarchie");
    setRefreshCounter(prev => prev + 1);
    refetchDepartments();
    refetchEmployees();
  }, [refetchDepartments, refetchEmployees]);
  
  // Fonction pour créer automatiquement un PDG si aucun n'existe
  const createDefaultCEO = useCallback(async () => {
    if (isCreatingCEO) return;
    
    try {
      setIsCreatingCEO(true);
      const departmentId = departments?.[0]?.id || '';
      
      // Créer un nouvel employé PDG
      const newCEO = {
        firstName: "Direction",
        lastName: "Générale",
        email: "direction@entreprise.com",
        phone: "",
        position: "PDG",
        department: departmentId,
        departmentId: departmentId,
        status: "active",
        photo: "",
        isManager: true,
        professionalEmail: "direction@entreprise.com",
        contract: "cdi",
        hireDate: new Date().toISOString().split('T')[0],
        forceManager: true,
      };
      
      console.log("Création d'un PDG par défaut:", newCEO);
      const result = await addDocument(COLLECTIONS.HR.EMPLOYEES, newCEO);
      
      if (result && result.id) {
        toast.success("Un PDG par défaut a été créé pour initialiser l'organigramme");
        await refetchEmployees();
        setRefreshCounter(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors de la création du PDG par défaut:", error);
      toast.error("Impossible de créer un PDG par défaut");
    } finally {
      setIsCreatingCEO(false);
    }
  }, [departments, isCreatingCEO, refetchEmployees]);
  
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
      (!emp.managerId || emp.forceManager === true) && 
      (emp.position?.toLowerCase().includes('pdg') || 
       emp.position?.toLowerCase().includes('ceo') || 
       emp.position?.toLowerCase().includes('directeur général') ||
       emp.position?.toLowerCase().includes('président') ||
       emp.position?.toLowerCase().includes('direction'))
    );
    
    if (!ceo) {
      console.log("Aucun dirigeant principal trouvé dans les données");
      setHierarchyData(null);
      return;
    }
    
    console.log("PDG/Dirigeant principal trouvé:", ceo.firstName, ceo.lastName, ceo.position);
    
    // Fonction récursive pour construire l'arbre hiérarchique
    const buildHierarchyTree = (manager: Employee): HierarchyNode => {
      const subordinates = employees.filter(emp => emp.managerId === manager.id && emp.id !== manager.id);
      
      console.log(`${manager.firstName} ${manager.lastName} a ${subordinates.length} subordonnés directs`);
      
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
    console.log("Arbre hiérarchique construit:", hierarchyTree);
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
    refreshHierarchy,
    createDefaultCEO
  };
};
