
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { 
  createEmployee as createEmployeeService,
  updateEmployee as updateEmployeeService,
  deleteEmployee as deleteEmployeeService,
  syncManagerStatus
} from '@/components/module/submodules/employees/services/employeeService';
import { checkForDuplicateEmail } from '@/components/module/submodules/employees/services/employeeService';
import { toast } from 'sonner';
import { useHrModuleData } from './useHrModuleData';

export const useEmployeeActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchAllHrData } = useHrModuleData() || { fetchAllHrData: () => Promise.resolve() };
  
  const createEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      setIsCreating(true);
      
      // Vérifier si l'email existe déjà
      const emailExists = await checkForDuplicateEmail(employeeData.email);
      if (emailExists) {
        toast.error("Un employé avec cet email existe déjà");
        return null;
      }
      
      // Créer l'employé
      const newEmployee = await createEmployeeService(employeeData);
      
      // Si l'employé est un manager, mettre à jour son statut de manager
      if (employeeData.isManager || employeeData.forceManager) {
        await syncManagerStatus({
          ...newEmployee,
          isManager: true
        });
      }
      
      // Mettre à jour les données
      await fetchAllHrData();
      
      // Notification à l'utilisateur
      toast.success("Employé créé avec succès");
      
      // Renvoyer le nouvel employé créé
      return newEmployee;
    } catch (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      toast.error("Erreur lors de la création de l'employé");
      return null;
    } finally {
      setIsCreating(false);
    }
  };
  
  const updateEmployee = async (updateData: Partial<Employee>) => {
    if (!updateData.id) {
      toast.error("ID d'employé manquant");
      return null;
    }
    
    try {
      setIsUpdating(true);
      
      // Vérifier si l'email existe déjà (sauf pour cet employé)
      if (updateData.email) {
        const emailExists = await checkForDuplicateEmail(updateData.email, updateData.id);
        if (emailExists) {
          toast.error("Un autre employé utilise déjà cet email");
          return null;
        }
      }
      
      // Mettre à jour l'employé
      await updateEmployeeService(updateData.id, updateData);
      
      // Gérer le statut de manager si nécessaire
      if (updateData.isManager !== undefined || updateData.forceManager !== undefined) {
        await syncManagerStatus({
          id: updateData.id,
          isManager: updateData.isManager || updateData.forceManager || false,
          firstName: updateData.firstName || '',
          lastName: updateData.lastName || '',
          email: updateData.email || ''
        } as Employee);
      }
      
      // Mettre à jour les données
      await fetchAllHrData();
      
      // Notification à l'utilisateur
      toast.success("Employé mis à jour avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const deleteEmployee = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Supprimer l'employé
      await deleteEmployeeService(id);
      
      // Mettre à jour les données
      await fetchAllHrData();
      
      // Notification à l'utilisateur
      toast.success("Employé supprimé avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast.error("Erreur lors de la suppression de l'employé");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isCreating,
    isUpdating,
    isDeleting
  };
};
