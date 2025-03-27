import { Department } from '../types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useDepartmentService = () => {
  const departmentsFirestore = useFirestore(COLLECTIONS.EMPLOYEES + '_departments');
  
  // Clé de stockage local
  const LOCAL_STORAGE_KEY = 'employees_departments_data';
  // Clé pour la dernière mise à jour
  const LAST_UPDATE_KEY = 'employees_departments_last_update';

  // Cache en mémoire pour éviter les accès répétés à localStorage
  let cachedDepartments: Department[] | null = null;
  let lastCacheTime = 0;
  const CACHE_TTL = 60000; // 1 minute en millisecondes

  const getAll = async (): Promise<Department[]> => {
    try {
      // Vérifier si nous avons des données en cache qui sont encore valides
      const now = Date.now();
      if (cachedDepartments && (now - lastCacheTime) < CACHE_TTL) {
        console.log("Using cached departments data");
        return cachedDepartments;
      }
      
      // Tenter de récupérer depuis Firestore
      const data = await departmentsFirestore.getAll();
      if (data && data.length > 0) {
        // Sauvegarder dans le cache en mémoire
        cachedDepartments = data as Department[];
        lastCacheTime = now;
        
        // Sauvegarder dans localStorage comme sauvegarde
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          localStorage.setItem(LAST_UPDATE_KEY, now.toString());
        } catch (e) {
          console.warn("Failed to save to localStorage:", e);
        }
        
        return data as Department[];
      }
      
      // Si aucune donnée Firestore, essayer le stockage local
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          const parsedData = JSON.parse(localData) as Department[];
          
          // Mettre en cache
          cachedDepartments = parsedData;
          lastCacheTime = now;
          
          console.log("Loaded departments from local storage:", parsedData);
          return parsedData;
        }
      } catch (e) {
        console.warn("Failed to load from localStorage:", e);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      
      // En cas d'erreur, essayer le cache d'abord
      if (cachedDepartments) {
        return cachedDepartments;
      }
      
      // Puis essayer le stockage local
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          return JSON.parse(localData) as Department[];
        }
      } catch (e) {
        console.warn("Failed to load from localStorage:", e);
      }
      
      toast.error("Erreur lors du chargement des départements");
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
      
      // Mise à jour du timestamp
      localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      
      // Notifier les autres composants (comme la hiérarchie) que des données ont changé
      window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'create', department } }));
      
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
        
        // Mise à jour du timestamp même en mode offline
        localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
        
        // Notifier les autres composants
        window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'create', department } }));
        
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
      
      // Mise à jour du timestamp
      localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      
      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'update', department } }));
      
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
          
          // Mise à jour du timestamp même en mode offline
          localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
          
          // Notifier les autres composants
          window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'update', department } }));
          
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
      
      // Mise à jour du timestamp
      localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      
      // Notifier les autres composants
      window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'delete', id, name } }));
      
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
          
          // Mise à jour du timestamp même en mode offline
          localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
          
          // Notifier les autres composants
          window.dispatchEvent(new CustomEvent('department-updated', { detail: { action: 'delete', id, name } }));
          
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

  const clearCache = () => {
    cachedDepartments = null;
    lastCacheTime = 0;
  };

  const getLastUpdateTimestamp = (): number => {
    try {
      const timestamp = localStorage.getItem(LAST_UPDATE_KEY);
      return timestamp ? parseInt(timestamp) : 0;
    } catch (e) {
      return 0;
    }
  };

  return {
    getAll,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearCache,
    getLastUpdateTimestamp
  };
};
