
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { HierarchyNode } from '../types/hierarchy-types';
import { findCEO, createHierarchyTree } from '../utils/hierarchyUtils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Hook pour gérer les données de la hiérarchie des employés
 */
export const useHierarchyData = () => {
  const { employees, isLoading, error } = useEmployeeData();
  const { refetchEmployees } = useHrModuleData();
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null);
  const [leader, setLeader] = useState<Employee | null>(null);
  const [isCreatingDefaultCEO, setIsCreatingDefaultCEO] = useState(false);
  const [departmentStats, setDepartmentStats] = useState({
    departmentsCount: 0,
    managersCount: 0
  });

  // Fonction pour créer un CEO par défaut
  const createDefaultCEO = async () => {
    try {
      setIsCreatingDefaultCEO(true);
      
      // Créer un nouveau CEO dans Firestore
      const defaultCEO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'ceo@company.com',
        position: 'CEO',
        title: 'Directeur Général',
        department: 'Direction',
        managerId: '',  // Pas de manager
        isManager: true,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        hireDate: new Date().toISOString(),
        forceManager: true
      };
      
      // Ajouter le CEO à la collection employees
      await addDoc(collection(db, COLLECTIONS.HR.EMPLOYEES), defaultCEO);
      
      toast.success('CEO par défaut créé avec succès');
      
      // Actualiser les données
      if (refetchEmployees) {
        await refetchEmployees();
      }
    } catch (error) {
      console.error("Erreur lors de la création du CEO par défaut:", error);
      toast.error("Erreur lors de la création du CEO");
    } finally {
      setIsCreatingDefaultCEO(false);
    }
  };

  // Function to refresh hierarchy data
  const refreshHierarchy = useCallback(async () => {
    if (refetchEmployees) {
      await refetchEmployees();
    }
  }, [refetchEmployees]);

  // Calculate departments statistics
  useEffect(() => {
    if (employees && employees.length > 0) {
      // Get unique departments
      const uniqueDepartments = new Set(
        employees.map(emp => emp.department).filter(Boolean)
      );
      
      // Count managers (employees who have direct reports)
      const managersIds = new Set();
      employees.forEach(emp => {
        if (emp.managerId) {
          managersIds.add(emp.managerId);
        }
      });
      
      setDepartmentStats({
        departmentsCount: uniqueDepartments.size,
        managersCount: managersIds.size
      });
    }
  }, [employees]);

  // Génération de la hiérarchie à partir des employés
  useEffect(() => {
    if (!employees || employees.length === 0) {
      setHierarchyData(null);
      setLeader(null);
      return;
    }

    console.log(`Génération de la hiérarchie à partir de ${employees.length} employés`);
    
    try {
      // Identifier le PDG ou le responsable principal
      const ceo = findCEO(employees);
      setLeader(ceo);

      if (!ceo) {
        console.log("Aucun CEO trouvé dans les données");
        setHierarchyData(null);
        return;
      }

      console.log(`CEO trouvé: ${ceo.firstName} ${ceo.lastName}`);
      
      // Créer l'arbre hiérarchique
      const hierarchyTree = createHierarchyTree(ceo, employees);
      setHierarchyData(hierarchyTree);
    } catch (error) {
      console.error("Erreur lors de la génération de la hiérarchie:", error);
      setHierarchyData(null);
      setLeader(null);
    }
  }, [employees]);

  return {
    hierarchyData,
    leader,
    isLoading,
    error,
    isCreatingDefaultCEO,
    createDefaultCEO,
    refreshHierarchy,
    departmentStats
  };
};
