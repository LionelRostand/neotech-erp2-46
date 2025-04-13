
import { useCallback } from 'react';
import { Department } from '../types';
import { useDepartmentService } from '../services/departmentService';
import { prepareDepartmentFromForm } from '../utils/departmentUtils';
import { toast } from 'sonner';

export const useDepartmentOperations = () => {
  const departmentService = useDepartmentService();
  
  const handleSaveDepartment = useCallback(async (formData: any, selectedEmployees: string[]) => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    
    try {
      const departmentToSave = prepareDepartmentFromForm(formData, selectedEmployees);
      const success = await departmentService.createDepartment(departmentToSave);
      
      if (success) {
        toast.success(`Département ${formData.name} créé avec succès`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
      return false;
    }
  }, [departmentService]);
  
  const handleUpdateDepartment = useCallback(async (formData: any, selectedEmployees: string[], currentDepartment: Department | null) => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    
    if (!currentDepartment || !currentDepartment.id) {
      toast.error("Aucun département sélectionné pour la mise à jour ou ID manquant");
      return false;
    }
    
    try {
      console.log("Current department before update:", currentDepartment);
      
      // S'assurer que nous utilisons l'ID existant et préservons les métadonnées
      const departmentToUpdate: Department = {
        ...currentDepartment,  // Préserver toutes les propriétés existantes
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId === "none" ? null : formData.managerId,
        color: formData.color,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };
      
      console.log("Department to update:", departmentToUpdate);
      
      // Mise à jour du département existant
      const success = await departmentService.updateDepartment(departmentToUpdate);
      
      if (success) {
        toast.success(`Département ${formData.name} mis à jour avec succès`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
      return false;
    }
  }, [departmentService]);
  
  const handleDeleteDepartment = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${name}" ?`)) {
      try {
        const success = await departmentService.deleteDepartment(id, name);
        
        if (success) {
          toast.success(`Département ${name} supprimé avec succès`);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Erreur lors de la suppression du département");
        return false;
      }
    }
    return false;
  }, [departmentService]);
  
  const handleSaveEmployeeAssignments = useCallback(async (currentDepartment: Department | null, selectedEmployees: string[]) => {
    if (!currentDepartment) {
      toast.error("Aucun département sélectionné");
      return false;
    }
    
    try {
      const updatedDepartment: Department = {
        ...currentDepartment,  // Préserver toutes les propriétés existantes
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };
      
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        toast.success(`Assignations d'employés mises à jour pour ${currentDepartment.name}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating employee assignments:", error);
      toast.error("Erreur lors de la mise à jour des assignations d'employés");
      return false;
    }
  }, [departmentService]);
  
  return {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  };
};
