
import { Department } from '../types';
import { addDocument, getAllDocuments, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useDepartmentService = () => {
  // Collection de départements dans Firestore - use the hr_departments collection
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
      // Mettre à jour dans Firestore
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
