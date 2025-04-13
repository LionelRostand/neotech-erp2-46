import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { toast } from 'sonner';
import { determineIfManager, syncManagerStatus, checkEmployeeExists } from '../form/employeeUtils';
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/firestore-utils';
import { collection, getDocs, query, orderBy, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Vérifie si un employé avec le même email existe déjà
 * @param email Email à vérifier
 * @returns true si un employé avec cet email existe, false sinon
 */
export const checkEmployeeEmailExists = async (email: string): Promise<boolean> => {
  try {
    if (!email) return false;
    
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const q = query(employeesRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email de l'employé:", error);
    return false;
  }
};

/**
 * Crée un nouvel employé dans Firestore
 * @param employeeData Données de l'employé à créer
 * @returns L'employé créé avec son ID
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log("Création d'un employé avec les données:", employeeData);
    
    // Vérifier si un employé avec cet email existe déjà
    if (employeeData.email) {
      const emailExists = await checkEmployeeEmailExists(employeeData.email);
      if (emailExists) {
        console.error(`Un employé avec l'email ${employeeData.email} existe déjà`);
        toast.error(`Un employé avec l'email ${employeeData.email} existe déjà`);
        return null;
      }
    }
    
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
    
    // Vérifier si l'employé existe
    const exists = await checkEmployeeExists(employeeId);
    if (!exists) {
      console.error(`L'employé avec l'ID ${employeeId} n'existe pas`);
      toast.error(`Impossible de mettre à jour: l'employé n'existe pas`);
      return null;
    }
    
    // Vérifier si l'employé est un manager (soit par son poste soit par forceManager)
    const isPositionManager = determineIfManager(employeeData.position);
    const isManager = employeeData.isManager || isPositionManager;
    
    console.log(`L'employé ${employeeData.firstName} ${employeeData.lastName} est-il un manager?`, {
      isPositionManager,
      forceManager: employeeData.isManager && !isPositionManager,
      finalStatus: isManager
    });
    
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
 * Met à jour les compétences d'un employé
 * @param employeeId ID de l'employé à mettre à jour
 * @param skills Nouvelles compétences
 * @returns L'employé mis à jour
 */
export const updateEmployeeSkills = async (employeeId: string, skills: string[]): Promise<Employee | null> => {
  try {
    console.log(`Mise à jour des compétences de l'employé ${employeeId}:`, skills);
    
    // Mettre à jour uniquement le champ 'skills'
    const result = await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, { 
      skills, 
      updatedAt: new Date().toISOString() 
    }) as Employee;
    
    // Si c'est un manager, mettre à jour également dans la collection des managers
    if (result.isManager) {
      await updateDocument(COLLECTIONS.HR.MANAGERS, employeeId, { 
        skills, 
        updatedAt: new Date().toISOString() 
      });
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des compétences:", error);
    throw error;
  }
};

/**
 * Obtient un employé par son ID
 * @param employeeId ID de l'employé à récupérer
 */
export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    const employee = await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId) as Employee;
    return employee || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'employé:", error);
    return null;
  }
};

/**
 * Récupère tous les employés
 * @returns Liste de tous les employés
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesQuery = query(employeesRef, orderBy('lastName', 'asc'));
    const employeesSnapshot = await getDocs(employeesQuery);
    
    // Récupérer les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersQuery = query(managersRef, orderBy('lastName', 'asc'));
    const managersSnapshot = await getDocs(managersQuery);
    
    // Combiner les deux ensembles de résultats
    const regularEmployees = employeesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        isManager: false
      } as unknown as Employee;
    });
    
    const managerEmployees = managersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        isManager: true
      } as unknown as Employee;
    });
    
    // Filtrer pour éliminer les doublons par ID
    const allEmployees = [...regularEmployees, ...managerEmployees];
    const uniqueEmployeesMap = new Map();
    
    allEmployees.forEach(employee => {
      if (!uniqueEmployeesMap.has(employee.id)) {
        uniqueEmployeesMap.set(employee.id, employee);
      }
    });
    
    const uniqueEmployees = Array.from(uniqueEmployeesMap.values()) as Employee[];
    
    // Trier par nom de famille
    const sortedEmployees = uniqueEmployees.sort((a, b) => 
      (a.lastName || '').localeCompare(b.lastName || '') || 0
    );
    
    return sortedEmployees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    // Return an empty array instead of null to avoid type errors
    return [];
  }
};

/**
 * Rafraîchit les données des employés
 * Utilisé pour mettre à jour les affichages après des modifications
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log("Rafraîchissement des données des employés...");
    // Fetch fresh employee data
    const employees = await getAllEmployees();
    
    toast.success("Données des employés rafraîchies");
    return employees;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des données:", error);
    toast.error("Erreur lors du rafraîchissement des données");
    return [];
  }
};

/**
 * Supprime un employé
 * @param employeeId ID de l'employé à supprimer
 */
export const deleteEmployee = async (employeeId: string): Promise<boolean> => {
  try {
    // Vérifier si l'employé existe
    const employee = await getEmployeeById(employeeId);
    if (!employee) {
      toast.error("Employé introuvable");
      return false;
    }
    
    // Supprimer l'employé de la collection principale
    await deleteDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId));
    
    // Si c'est un manager, supprimer également de la collection des managers
    if (employee.isManager) {
      await deleteDoc(doc(db, COLLECTIONS.HR.MANAGERS, employeeId));
    }
    
    toast.success(`Employé ${employee.firstName} ${employee.lastName} supprimé avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    toast.error("Erreur lors de la suppression de l'employé");
    return false;
  }
};
