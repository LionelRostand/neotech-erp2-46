
import { Department } from '../types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useDepartmentService = () => {
  const departmentsFirestore = useFirestore(COLLECTIONS.EMPLOYEES + '_departments');
  
  // Clé de stockage local
  const LOCAL_STORAGE_KEY = 'employees_departments_data';

  const getAll = async (): Promise<Department[]> => {
    try {
      // Tenter de récupérer depuis Firestore
      const data = await departmentsFirestore.getAll();
      if (data && data.length > 0) {
        // Sauvegarder dans localStorage comme sauvegarde
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data as Department[];
      }
      
      // Si aucune donnée Firestore, essayer le stockage local
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log("Loaded departments from local storage:", parsedData);
        return parsedData as Department[];
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Erreur lors du chargement des départements");
      
      // En cas d'erreur, essayer le stockage local
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        return JSON.parse(localData) as Department[];
      }
      
      return [];
    }
  };

  const createDepartment = async (department: Department): Promise<boolean> => {
    try {
      // Tenter d'enregistrer dans Firestore
      await departmentsFirestore.set(department.id, department);
      
      // Sauvegarder également dans localStorage
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const departments = existingData ? JSON.parse(existingData) as Department[] : [];
      departments.push(department);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(departments));
      
      toast.success(`Département ${department.name} créé avec succès`);
      return true;
    } catch (error) {
      console.error("Error saving department to Firestore:", error);
      
      // Sauvegarder dans localStorage comme sauvegarde
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const departments = existingData ? JSON.parse(existingData) as Department[] : [];
        departments.push(department);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(departments));
        
        toast.success(`Département ${department.name} créé localement`);
        return true;
      } catch (localError) {
        console.error("Error saving department locally:", localError);
        toast.error("Erreur lors de la création du département");
        return false;
      }
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      // Tenter de mettre à jour dans Firestore
      await departmentsFirestore.update(department.id, department);
      
      // Mettre à jour également dans localStorage
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (existingData) {
        const departments = JSON.parse(existingData) as Department[];
        const updatedDepartments = departments.map(dep => 
          dep.id === department.id ? department : dep
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDepartments));
      }
      
      toast.success(`Département ${department.name} mis à jour avec succès`);
      return true;
    } catch (error) {
      console.error("Error updating department in Firestore:", error);
      
      // Mettre à jour dans localStorage comme sauvegarde
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (existingData) {
          const departments = JSON.parse(existingData) as Department[];
          const updatedDepartments = departments.map(dep => 
            dep.id === department.id ? department : dep
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDepartments));
          
          toast.success(`Département ${department.name} mis à jour localement`);
          return true;
        }
        return false;
      } catch (localError) {
        console.error("Error updating department locally:", localError);
        toast.error("Erreur lors de la mise à jour du département");
        return false;
      }
    }
  };

  const deleteDepartment = async (id: string, name: string): Promise<boolean> => {
    if (!id) {
      console.error("Invalid department ID");
      toast.error("ID du département invalide");
      return false;
    }
    
    try {
      // Tenter de supprimer dans Firestore
      await departmentsFirestore.remove(id);
      
      // Supprimer également dans localStorage
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (existingData) {
        const departments = JSON.parse(existingData) as Department[];
        const filteredDepartments = departments.filter(dep => dep.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredDepartments));
      }
      
      toast.success(`Département ${name} supprimé avec succès`);
      return true;
    } catch (error) {
      console.error("Error deleting department from Firestore:", error);
      
      // Supprimer dans localStorage comme sauvegarde
      try {
        const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (existingData) {
          const departments = JSON.parse(existingData) as Department[];
          const filteredDepartments = departments.filter(dep => dep.id !== id);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredDepartments));
          
          toast.success(`Département ${name} supprimé localement`);
          return true;
        }
        return false;
      } catch (localError) {
        console.error("Error deleting department locally:", localError);
        toast.error("Erreur lors de la suppression du département");
        return false;
      }
    }
  };

  return {
    getAll,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};
