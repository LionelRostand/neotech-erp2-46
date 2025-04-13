import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { toast } from 'sonner';
import { determineIfManager, syncManagerStatus } from '../form/employeeUtils';

/**
 * Crée un nouvel employé dans Firestore
 * @param employeeData Données de l'employé à créer
 * @returns L'employé créé avec son ID
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log("Création d'un employé avec les données:", employeeData);
    
    // Vérifier si l'employé est un manager
    const isManager = determineIfManager(employeeData.position);
    console.log(`L'employé ${employeeData.firstName} ${employeeData.lastName} est-il un manager?`, isManager);
    
    // Ajouter le statut de manager et mettre à jour le rôle
    employeeData.isManager = isManager;
    employeeData.role = isManager ? 'manager' : 'employee';
    
    // Ajouter l'employé à la collection principale
    const result = await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData) as Employee;
    
    // Si c'est un manager, ajouter également à la collection des managers
    if (isManager && result.id) {
      console.log(`Ajout de ${result.firstName} ${result.lastName} à la collection des managers`);
      await setDocument(COLLECTIONS.HR.MANAGERS, result.id, {
        ...result,
        role: 'manager',
      });
    }
    
    toast.success(`Employé ${employeeData.firstName} ${employeeData.lastName} créé avec succès`);
    return result;
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    toast.error("Erreur lors de la création de l'employé");
    return null;
  }
};

/**
 * Met à jour un employé existant dans Firestore
 * @param employeeId ID de l'employé à mettre à jour
 * @param employeeData Données de l'employé à mettre à jour
 * @returns L'employé mis à jour
 */
export const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log(`Mise à jour de l'employé ${employeeId} avec les données:`, employeeData);
    
    // Vérifier si l'employé est un manager
    const isManager = determineIfManager(employeeData.position);
    console.log(`L'employé ${employeeData.firstName} ${employeeData.lastName} est-il un manager?`, isManager);
    
    // Mettre à jour l'employé dans la collection principale
    employeeData.isManager = isManager;
    employeeData.role = isManager ? 'manager' : 'employee';
    employeeData.updatedAt = new Date().toISOString();
    
    const result = await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, employeeData) as Employee;
    
    // Synchroniser avec la collection des managers
    await syncManagerStatus(result);
    
    toast.success(`Employé ${employeeData.firstName} ${employeeData.lastName} mis à jour avec succès`);
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    toast.error("Erreur lors de la mise à jour de l'employé");
    return null;
  }
};

/**
 * Obtient un employé par son ID
 * @param employeeId ID de l'employé à récupérer
 */
export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  // Cette fonction utiliserait la lecture Firestore, mais nous la laisserons
  // pour l'implémentation future car elle pourrait dépendre de vos hooks de données
  return null;
};
