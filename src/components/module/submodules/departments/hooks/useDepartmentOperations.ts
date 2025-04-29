
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Department } from '../types';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/hr-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument, deleteDocument, updateDocument } from '@/lib/firestore-helpers';

export const useDepartmentOperations = () => {
  const { refetch: refetchDepartments } = useFirebaseDepartments();
  const { employees, refetch: refetchEmployees } = useEmployeeData();

  // Récupérer les employés d'un département
  const getDepartmentEmployees = useCallback((departmentId: string): string[] => {
    if (!departmentId || !employees || !Array.isArray(employees)) {
      return [];
    }
    
    return employees
      .filter(emp => 
        emp.departmentId === departmentId || 
        emp.department === departmentId
      )
      .map(emp => emp.id);
  }, [employees]);

  // Sauvegarder un nouveau département
  const handleSaveDepartment = useCallback(async (formData: Partial<Department>, selectedEmployeeIds: string[]) => {
    try {
      // Valider les données obligatoires
      if (!formData.name) {
        toast.error("Le nom du département est obligatoire");
        return;
      }

      // Préparer les données du département
      const departmentData = {
        ...formData,
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        createdAt: new Date().toISOString()
      };

      // Sauvegarder le département
      await addDocument(COLLECTIONS.HR.DEPARTMENTS, departmentData);

      // Mettre à jour les employés sélectionnés
      if (selectedEmployeeIds.length > 0) {
        const updatePromises = selectedEmployeeIds.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: departmentData.id,
            department: departmentData.name
          })
        );
        await Promise.all(updatePromises);
      }

      // Rafraîchir les données
      refetchDepartments();
      refetchEmployees();

      toast.success("Département créé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la création du département:", error);
      toast.error("Erreur lors de la création du département");
      return false;
    }
  }, [refetchDepartments, refetchEmployees]);

  // Mettre à jour un département
  const handleUpdateDepartment = useCallback(async (formData: Partial<Department>, selectedEmployeeIds: string[]) => {
    try {
      // Valider les données obligatoires
      if (!formData.id || !formData.name) {
        toast.error("Informations de département incomplètes");
        return;
      }

      // Récupérer les employés actuels du département
      const currentEmployeeIds = getDepartmentEmployees(formData.id);
      
      // Identifier les employés à ajouter et à supprimer
      const employeesToAdd = selectedEmployeeIds.filter(id => !currentEmployeeIds.includes(id));
      const employeesToRemove = currentEmployeeIds.filter(id => !selectedEmployeeIds.includes(id));

      // Préparer les données du département
      const departmentData = {
        ...formData,
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour le département
      await updateDocument(COLLECTIONS.HR.DEPARTMENTS, formData.id, departmentData);

      // Mettre à jour les employés à ajouter
      if (employeesToAdd.length > 0) {
        const addPromises = employeesToAdd.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: departmentData.id,
            department: departmentData.name
          })
        );
        await Promise.all(addPromises);
      }

      // Mettre à jour les employés à supprimer
      if (employeesToRemove.length > 0) {
        const removePromises = employeesToRemove.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: '',
            department: ''
          })
        );
        await Promise.all(removePromises);
      }

      // Rafraîchir les données
      refetchDepartments();
      refetchEmployees();

      toast.success("Département mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du département:", error);
      toast.error("Erreur lors de la mise à jour du département");
      return false;
    }
  }, [refetchDepartments, refetchEmployees, getDepartmentEmployees]);

  // Gérer les affectations d'employés
  const handleSaveEmployeeAssignments = useCallback(async (departmentId: string, departmentName: string, selectedEmployeeIds: string[]) => {
    try {
      if (!departmentId) {
        toast.error("ID de département manquant");
        return;
      }

      // Récupérer les employés actuels du département
      const currentEmployeeIds = getDepartmentEmployees(departmentId);
      
      // Identifier les employés à ajouter et à supprimer
      const employeesToAdd = selectedEmployeeIds.filter(id => !currentEmployeeIds.includes(id));
      const employeesToRemove = currentEmployeeIds.filter(id => !selectedEmployeeIds.includes(id));

      // Mettre à jour le département
      await updateDocument(COLLECTIONS.HR.DEPARTMENTS, departmentId, {
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        updatedAt: new Date().toISOString()
      });

      // Mettre à jour les employés à ajouter
      if (employeesToAdd.length > 0) {
        const addPromises = employeesToAdd.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: departmentId,
            department: departmentName
          })
        );
        await Promise.all(addPromises);
      }

      // Mettre à jour les employés à supprimer
      if (employeesToRemove.length > 0) {
        const removePromises = employeesToRemove.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: '',
            department: ''
          })
        );
        await Promise.all(removePromises);
      }

      // Rafraîchir les données
      refetchDepartments();
      refetchEmployees();

      toast.success("Employés assignés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'assignation des employés:", error);
      toast.error("Erreur lors de l'assignation des employés");
      return false;
    }
  }, [refetchDepartments, refetchEmployees, getDepartmentEmployees]);

  // Supprimer un département
  const handleDeleteDepartment = useCallback(async (departmentId: string, departmentName: string) => {
    try {
      if (!departmentId) {
        toast.error("ID de département manquant");
        return;
      }

      // Confirmation
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${departmentName}" ?`)) {
        return;
      }

      // Récupérer les employés du département
      const departmentEmployeeIds = getDepartmentEmployees(departmentId);

      // Supprimer le département
      await deleteDocument(COLLECTIONS.HR.DEPARTMENTS, departmentId);

      // Mettre à jour les employés du département
      if (departmentEmployeeIds.length > 0) {
        const updatePromises = departmentEmployeeIds.map(employeeId => 
          updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
            departmentId: '',
            department: ''
          })
        );
        await Promise.all(updatePromises);
      }

      // Rafraîchir les données
      refetchDepartments();
      refetchEmployees();

      toast.success("Département supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du département:", error);
      toast.error("Erreur lors de la suppression du département");
      return false;
    }
  }, [refetchDepartments, refetchEmployees, getDepartmentEmployees]);

  return {
    getDepartmentEmployees,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleSaveEmployeeAssignments,
    handleDeleteDepartment
  };
};
