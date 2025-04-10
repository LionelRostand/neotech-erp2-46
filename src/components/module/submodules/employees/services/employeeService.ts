
import { Employee } from '@/types/employee';
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

// Récupérer tous les employés depuis Firestore
export const getEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log('Récupération des données employés depuis Firestore...');
    
    // Utiliser HR.EMPLOYEES au lieu de la collection EMPLOYEES
    const firestoreData = await executeWithNetworkRetry(async () => {
      return await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
    });
    
    // Vérifier si les données sont valides et non vides
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      return firestoreData as Employee[];
    }
    
    console.log('Aucune donnée trouvée dans Firestore');
    toast.error("Aucune donnée d'employé trouvée");
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    toast.error("Erreur lors du chargement des employés");
    return [];
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    console.log(`Récupération de l'employé ${id} depuis Firestore`);
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.EMPLOYEES, id);
    });
    
    if (employeeData) {
      console.log(`Employé ${id} récupéré depuis Firestore`);
      return employeeData as Employee;
    }
    
    console.log(`Employé ${id} non trouvé dans Firestore`);
    toast.error("Employé non trouvé");
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
    toast.error(`Erreur lors du chargement des données de l'employé`);
    return null;
  }
};

// Ajouter un nouvel employé dans Firestore
export const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    console.log('Ajout d\'un nouvel employé dans Firestore...');
    const newEmployee = await executeWithNetworkRetry(async () => {
      return await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData);
    });
    
    console.log('Employé ajouté avec succès:', newEmployee);
    return newEmployee as Employee;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'employé:", error);
    toast.error("Erreur lors de l'ajout de l'employé");
    return null;
  }
};

// Mettre à jour un employé existant dans Firestore
export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log(`Mise à jour de l'employé ${id} dans Firestore...`);
    const updatedEmployee = await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, id, employeeData);
    });
    
    console.log('Employé mis à jour avec succès:', updatedEmployee);
    return updatedEmployee as Employee;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    toast.error("Erreur lors de la mise à jour de l'employé");
    return null;
  }
};

// Supprimer un employé de Firestore
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    console.log(`Suppression de l'employé ${id} dans Firestore...`);
    await executeWithNetworkRetry(async () => {
      return await deleteDocument(COLLECTIONS.HR.EMPLOYEES, id);
    });
    
    console.log('Employé supprimé avec succès');
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    toast.error("Erreur lors de la suppression de l'employé");
    return false;
  }
};

// Fonction pour actualiser les données
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log("Actualisation des données employés depuis Firestore...");
    
    // Récupérer directement depuis Firestore avec executeWithNetworkRetry
    const firestoreData = await executeWithNetworkRetry(async () => {
      return await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
    });
    
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      toast.success("Données employés actualisées avec succès");
      return firestoreData as Employee[];
    } else {
      toast.warning("Aucune donnée trouvée sur Firestore");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de l'actualisation des employés:", error);
    toast.error("Échec de l'actualisation des données employés");
    return [];
  }
};

// Récupérer les employés par département
export const getEmployeesByDepartment = async (department: string): Promise<Employee[]> => {
  try {
    console.log(`Récupération des employés du département ${department} depuis Firestore...`);
    
    const employees = await executeWithNetworkRetry(async () => {
      const allEmployees = await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
      return allEmployees.filter((emp: any) => emp.department === department);
    });
    
    console.log(`${employees.length} employés récupérés pour le département ${department}`);
    return employees as Employee[];
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés du département ${department}:`, error);
    toast.error("Erreur lors du chargement des employés par département");
    return [];
  }
};

// Récupérer les employés par statut
export const getEmployeesByStatus = async (status: string): Promise<Employee[]> => {
  try {
    console.log(`Récupération des employés avec le statut ${status} depuis Firestore...`);
    
    const employees = await executeWithNetworkRetry(async () => {
      const allEmployees = await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
      return allEmployees.filter((emp: any) => emp.status === status);
    });
    
    console.log(`${employees.length} employés récupérés avec le statut ${status}`);
    return employees as Employee[];
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés avec le statut ${status}:`, error);
    toast.error("Erreur lors du chargement des employés par statut");
    return [];
  }
};
