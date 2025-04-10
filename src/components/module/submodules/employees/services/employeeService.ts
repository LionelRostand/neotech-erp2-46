
import { db } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  arrayUnion,
  collection,
  getDocs
} from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee, EmployeeAddress } from '@/types/employee';

/**
 * Met à jour les informations d'un employé
 */
export const updateEmployee = async (employeeId: string, updates: Partial<Employee>): Promise<boolean> => {
  try {
    if (!employeeId) {
      console.error("Erreur: ID d'employé manquant");
      return false;
    }
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return false;
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(employeeRef, updateData);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    return false;
  }
};

/**
 * Récupère les informations d'un employé
 */
export const getEmployee = async (employeeId: string): Promise<Employee | null> => {
  try {
    if (!employeeId) {
      console.error("Erreur: ID d'employé manquant");
      return null;
    }
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return null;
    }
    
    const employeeData = employeeDoc.data();
    return {
      id: employeeDoc.id,
      ...employeeData
    } as Employee;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'employé:", error);
    return null;
  }
};

/**
 * Alias pour getEmployee, pour maintenir la compatibilité
 */
export const getEmployeeById = getEmployee;

/**
 * Vérifie si un employé existe
 */
export const checkEmployeeExists = async (employeeId: string): Promise<boolean> => {
  try {
    if (!employeeId) return false;
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    return employeeDoc.exists();
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de l'employé:", error);
    return false;
  }
};

/**
 * Ajoute un document à un employé existant
 */
export const addDocumentToEmployee = async (
  employeeId: string, 
  documentId: string, 
  documentData: any
): Promise<boolean> => {
  try {
    if (!employeeId || !documentId) {
      console.error("Erreur: ID d'employé ou ID de document manquant");
      return false;
    }
    
    // Vérifier d'abord si l'employé existe
    const employeeExists = await checkEmployeeExists(employeeId);
    if (!employeeExists) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return false;
    }
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    await updateDoc(employeeRef, {
      documents: arrayUnion({
        id: documentId,
        name: documentData.name,
        type: documentData.type,
        date: documentData.date,
        fileUrl: documentData.fileUrl
      }),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document à l'employé:", error);
    return false;
  }
};

/**
 * Rafraîchit les données des employés
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    
    if (employeesSnapshot.empty) {
      console.log("Aucun employé trouvé");
      return [];
    }
    
    const employees: Employee[] = [];
    employeesSnapshot.forEach((doc) => {
      const data = doc.data();
      employees.push({
        id: doc.id,
        ...data
      } as Employee);
    });
    
    return employees;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des données des employés:", error);
    return [];
  }
};
