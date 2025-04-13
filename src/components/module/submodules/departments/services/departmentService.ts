
import { Department } from '../types';
import { addDocument, getAllDocuments, updateDocument, deleteDocument, getDocumentById, setDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useDepartmentService = () => {
  // Updated collection path for departments
  const DEPARTMENTS_COLLECTION = COLLECTIONS.HR.DEPARTMENTS;
  
  const getAll = async (): Promise<Department[]> => {
    try {
      // Récupérer les données depuis Firestore
      const data = await getAllDocuments(DEPARTMENTS_COLLECTION);
      console.log("Départements récupérés depuis Firebase:", data);
      return data as Department[];
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
      
      // Vérifier d'abord si le document existe
      const existingDoc = await getDocumentById(DEPARTMENTS_COLLECTION, department.id);
      
      if (existingDoc) {
        // Si le document existe, utilisez updateDocument
        await updateDocument(DEPARTMENTS_COLLECTION, department.id, department);
        console.log(`Document ${department.id} mis à jour avec updateDocument`);
      } else {
        // Si le document n'existe pas, utilisez setDocument
        console.log(`Document ${department.id} n'existe pas, création avec setDocument`);
        await setDocument(DEPARTMENTS_COLLECTION, department.id, department);
      }
      
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
