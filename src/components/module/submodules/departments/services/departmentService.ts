
import { Department } from '../types';
import { addDocument, getAllDocuments, updateDocument, deleteDocument, getDocumentById } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { getAllEmployees } from '@/components/module/submodules/employees/services/employeeService';

export const useDepartmentService = () => {
  // Updated collection path for departments
  const DEPARTMENTS_COLLECTION = COLLECTIONS.HR.DEPARTMENTS;
  
  const getAll = async (): Promise<Department[]> => {
    try {
      // Récupérer les données depuis Firestore
      const data = await getAllDocuments(DEPARTMENTS_COLLECTION);
      console.log("Départements récupérés depuis Firebase:", data);
      
      // Récupérer les employés pour enrichir les départements avec les noms de managers
      const employees = await getAllEmployees();
      
      // Filtrer les doublons par ID avant d'enrichir
      const uniqueDepartmentsMap = new Map();
      data.forEach(dept => {
        if (!uniqueDepartmentsMap.has(dept.id)) {
          uniqueDepartmentsMap.set(dept.id, dept);
        } else {
          console.warn(`Doublon détecté pour le département ID: ${dept.id}, nom: ${dept.name}`);
        }
      });
      
      const uniqueData = Array.from(uniqueDepartmentsMap.values());
      console.log(`Départements après filtrage des doublons: ${uniqueData.length} (avant: ${data.length})`);
      
      // Enrichir les départements avec les noms de managers
      const enrichedDepartments = uniqueData.map(department => {
        // Traiter chaque département comme un objet Department partiel
        const typedDepartment = department as Partial<Department>;
        
        if (typedDepartment.managerId) {
          const manager = employees.find(emp => emp.id === typedDepartment.managerId);
          if (manager) {
            typedDepartment.managerName = `${manager.firstName} ${manager.lastName}`;
          }
        }
        return typedDepartment as Department;
      });
      
      return enrichedDepartments;
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Erreur lors du chargement des départements");
      return [];
    }
  };

  const createDepartment = async (department: Department): Promise<boolean> => {
    try {
      // Enregistrer dans Firestore
      await addDocument(DEPARTMENTS_COLLECTION, department);
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
      // Vérifier que l'ID est présent
      if (!department.id) {
        console.error("Department ID is missing, cannot update");
        toast.error("ID du département manquant, impossible de mettre à jour");
        return false;
      }

      console.log(`Mise à jour du département ID: ${department.id}`, department);
      
      // Utiliser updateDocument pour mettre à jour le document existant
      // Cette fonction vérifie si le document existe avant de le mettre à jour
      await updateDocument(DEPARTMENTS_COLLECTION, department.id, department);
      
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
      // Vérifier si le document existe avant de le supprimer
      const existingDoc = await getDocumentById(DEPARTMENTS_COLLECTION, id);
      
      if (!existingDoc) {
        console.warn(`Department with ID ${id} does not exist. Nothing to delete.`);
        toast.info(`Le département ${name} n'existe pas ou a déjà été supprimé`);
        return true;
      }
      
      // Supprimer dans Firestore
      await deleteDocument(DEPARTMENTS_COLLECTION, id);
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
