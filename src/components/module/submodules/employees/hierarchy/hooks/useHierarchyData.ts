
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { HierarchyNode } from '../types/hierarchy-types';
import { findCEO, createHierarchyTree } from '../utils/hierarchyUtils';

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
      // TODO: Implémenter la création d'un CEO par défaut
      // Pour l'instant, juste rafraîchir les données
      if (refetchEmployees) {
        await refetchEmployees();
      }
    } catch (error) {
      console.error("Erreur lors de la création du CEO par défaut:", error);
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

    try {
      // Identifier le PDG ou le responsable principal
      const ceo = findCEO(employees);
      setLeader(ceo);

      if (!ceo) {
        setHierarchyData(null);
        return;
      }

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
