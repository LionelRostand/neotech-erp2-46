
import { Department } from '../types';
import { addDocument, getAllDocuments, updateDocument, deleteDocument, getDocumentById } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { getAllEmployees } from '@/components/module/submodules/employees/services/employeeService';
import { notifyDepartmentUpdates } from '../utils/departmentUtils';

export const useDepartmentService = () => {
  // Use the HR.DEPARTMENTS collection path
  const DEPARTMENTS_COLLECTION = COLLECTIONS.HR.DEPARTMENTS;
  
  const getAll = async (): Promise<Department[]> => {
    try {
      console.log("Attempting to fetch departments from collection:", DEPARTMENTS_COLLECTION);
      
      // Récupérer les données depuis Firestore
      const data = await getAllDocuments(DEPARTMENTS_COLLECTION);
      console.log("Départements récupérés depuis Firebase:", data);
      
      // Récupérer les employés pour enrichir les départements avec les noms de managers
      const employees = await getAllEmployees();
      
      // Ensure data is valid before proceeding
      if (!Array.isArray(data)) {
        console.error("Data returned is not an array:", data);
        return [];
      }
      
      // Filtrer les doublons par ID avant d'enrichir
      const uniqueDepartmentsMap = new Map();
      data.forEach(dept => {
        if (dept && dept.id && !uniqueDepartmentsMap.has(dept.id)) {
          uniqueDepartmentsMap.set(dept.id, dept);
        } else if (dept && dept.id) {
          // Cast to Department type or any to safely access name
          const deptObj = dept as Partial<Department>;
          console.warn(`Doublon détecté pour le département ID: ${dept.id}, nom: ${deptObj.name || 'Sans nom'}`);
        }
      });
      
      const uniqueData = Array.from(uniqueDepartmentsMap.values());
      console.log(`Départements après filtrage des doublons: ${uniqueData.length} (avant: ${data.length})`);
      
      // Enrichir les départements avec les noms de managers
      const enrichedDepartments = uniqueData.map(department => {
        // Make sure department is a valid object
        if (!department || typeof department !== 'object') {
          console.warn("Invalid department object:", department);
          return null;
        }
        
        // Cast to Department type after validation
        const typedDepartment = department as Partial<Department>;
        
        if (typedDepartment.managerId) {
          const manager = employees.find(emp => emp.id === typedDepartment.managerId);
          if (manager) {
            typedDepartment.managerName = `${manager.firstName} ${manager.lastName}`;
          }
        }
        
        // Ensure employeeIds is always an array
        if (!typedDepartment.employeeIds) {
          typedDepartment.employeeIds = [];
        }
        
        return typedDepartment as Department;
      }).filter(Boolean) as Department[]; // Remove null entries
      
      // Notify other components of the department updates
      notifyDepartmentUpdates(enrichedDepartments);
      
      return enrichedDepartments;
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Erreur lors du chargement des départements");
      return [];
    }
  };

  const createDepartment = async (department: Department): Promise<boolean> => {
    try {
      // Ensure employeeIds is an array
      if (!department.employeeIds) {
        department.employeeIds = [];
      }
      
      // Add timestamps
      department.createdAt = new Date().toISOString();
      department.updatedAt = new Date().toISOString();
      
      // Enregistrer dans Firestore
      await addDocument(DEPARTMENTS_COLLECTION, department);
      toast.success(`Département ${department.name} créé avec succès`);
      
      // Wait before re-fetching to avoid potential race conditions
      setTimeout(async () => {
        const updatedDepartments = await getAll();
        notifyDepartmentUpdates(updatedDepartments);
      }, 300);
      
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

      // Ensure employeeIds is an array
      if (!department.employeeIds) {
        department.employeeIds = [];
      }
      
      // Update timestamp
      department.updatedAt = new Date().toISOString();
      
      console.log(`Mise à jour du département ID: ${department.id}`, department);
      
      // Utiliser updateDocument pour mettre à jour le document existant
      await updateDocument(DEPARTMENTS_COLLECTION, department.id, department);
      
      toast.success(`Département ${department.name} mis à jour avec succès`);
      
      // Wait before re-fetching to avoid potential race conditions
      setTimeout(async () => {
        const updatedDepartments = await getAll();
        notifyDepartmentUpdates(updatedDepartments);
      }, 300);
      
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
      
      // Wait before re-fetching to avoid potential race conditions
      setTimeout(async () => {
        const updatedDepartments = await getAll();
        notifyDepartmentUpdates(updatedDepartments);
      }, 300);
      
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
