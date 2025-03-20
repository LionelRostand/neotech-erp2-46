
import { Department } from '../types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useDepartmentService = () => {
  const departmentsFirestore = useFirestore(COLLECTIONS.EMPLOYEES + '_departments');

  const getAll = async (): Promise<Department[]> => {
    try {
      const data = await departmentsFirestore.getAll();
      if (data && data.length > 0) {
        return data as Department[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Erreur lors du chargement des départements");
      return [];
    }
  };

  const createDepartment = async (department: Department): Promise<boolean> => {
    try {
      await departmentsFirestore.set(department.id, department);
      toast.success(`Département ${department.name} créé avec succès`);
      return true;
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
      return false;
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      await departmentsFirestore.update(department.id, department);
      toast.success(`Département ${department.name} mis à jour avec succès`);
      return true;
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
      return false;
    }
  };

  const deleteDepartment = async (id: string, name: string): Promise<boolean> => {
    if (!id) {
      console.error("Invalid department ID");
      toast.error("ID du département invalide");
      return false;
    }
    
    try {
      await departmentsFirestore.remove(id);
      toast.success(`Département ${name} supprimé avec succès`);
      return true;
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Erreur lors de la suppression du département");
      return false;
    }
  };

  return {
    getAll,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};
