
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
    
    // Utilisation de executeWithNetworkRetry pour gérer automatiquement les erreurs réseau
    const firestoreData = await executeWithNetworkRetry(async () => {
      // Utilisation de la collection définie dans COLLECTIONS pour garantir la cohérence
      return await getAllDocuments(COLLECTIONS.EMPLOYEES);
    });
    
    // Vérifier si les données sont valides et non vides
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      return firestoreData as Employee[];
    }
    
    console.log('Aucune donnée trouvée dans Firestore');
    const { employees } = await import('@/data/employees');
    return employees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    toast.error("Erreur lors du chargement des employés");
    
    // En cas d'erreur, utiliser les données simulées
    const { employees } = await import('@/data/employees');
    return employees;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    console.log(`Récupération de l'employé ${id} depuis Firestore`);
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.EMPLOYEES, id);
    });
    
    if (employeeData) {
      console.log(`Employé ${id} récupéré depuis Firestore`);
      return employeeData as Employee;
    }
    
    // Si pas trouvé, chercher dans les données simulées
    console.log(`Employé ${id} non trouvé dans Firestore, recherche dans les données simulées`);
    const { employees } = await import('@/data/employees');
    return employees.find(emp => emp.id === id) || null;
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
      return await addDocument(COLLECTIONS.EMPLOYEES, employeeData);
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
      return await updateDocument(COLLECTIONS.EMPLOYEES, id, employeeData);
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
      return await deleteDocument(COLLECTIONS.EMPLOYEES, id);
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
      return await getAllDocuments(COLLECTIONS.EMPLOYEES);
    });
    
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      toast.success("Données employés actualisées avec succès");
      return firestoreData as Employee[];
    } else {
      toast.warning("Aucune donnée trouvée sur Firestore");
      const { employees } = await import('@/data/employees');
      return employees;
    }
  } catch (error) {
    console.error("Erreur lors de l'actualisation des employés:", error);
    toast.error("Échec de l'actualisation des données employés");
    const { employees } = await import('@/data/employees');
    return employees;
  }
};
