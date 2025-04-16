import { useCallback } from 'react';
import { Department } from '../types';
import { useDepartmentService } from '../services/departmentService';
import { prepareDepartmentFromForm } from '../utils/departmentUtils';
import { toast } from 'sonner';
import { useEmployeeData } from '@/hooks/useEmployeeData';

export const useDepartmentOperations = () => {
  const departmentService = useDepartmentService();
  const { employees: allEmployees } = useEmployeeData();
  
  const handleSaveDepartment = useCallback(async (formData: any, selectedEmployees: string[]) => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    
    try {
      const departmentToSave = {
        ...prepareDepartmentFromForm(formData, selectedEmployees, allEmployees),
        companyId: formData.companyId === "none" ? null : formData.companyId
      };
      
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
  }, [departmentService, allEmployees]);
  
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
      console.log("Form data for update:", formData);
      
      // Find the selected manager from all employees
      const selectedManager = formData.managerId && formData.managerId !== "none"
        ? allEmployees.find(emp => emp.id === formData.managerId) 
        : null;

      const managerName = selectedManager 
        ? `${selectedManager.firstName} ${selectedManager.lastName}` 
        : null;
      
      // S'assurer que l'ID est conservé et que toutes les métadonnées sont préservées
      const departmentToUpdate: Department = {
        ...currentDepartment,  // Préserver toutes les propriétés existantes
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId === "none" ? null : formData.managerId,
        managerName: managerName,
        color: formData.color,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length,
        companyId: formData.companyId === "none" ? null : formData.companyId, // Ajouter l'ID de l'entreprise
      };
      
      console.log("Department to update:", departmentToUpdate);
      
      // Mettre à jour le département existant
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
  }, [departmentService, allEmployees]);
  
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
