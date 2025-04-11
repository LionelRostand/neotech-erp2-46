
import { db } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  arrayUnion,
  collection,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee, EmployeeAddress } from '@/types/employee';
import { toast } from 'sonner';

/**
 * Met à jour les informations d'un employé
 */
export const updateEmployee = async (employeeId: string, updates: Partial<Employee>): Promise<boolean> => {
  try {
    if (!employeeId) {
      console.error("Erreur: ID d'employé manquant");
      return false;
    }
    
    console.log(`Tentative de mise à jour de l'employé avec ID: ${employeeId}`);
    console.log("Collection path:", COLLECTIONS.HR.EMPLOYEES);
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé dans la collection ${COLLECTIONS.HR.EMPLOYEES}`);
      return false;
    }
    
    // Nettoyage des données avant mise à jour
    const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;
      
      if (key === 'address' && typeof value === 'object') {
        // Nettoyage spécifique pour l'objet adresse
        const cleanAddress = Object.entries(value).reduce((addrAcc, [addrKey, addrVal]) => {
          if (addrVal !== undefined) {
            addrAcc[addrKey] = addrVal;
          }
          return addrAcc;
        }, {} as Record<string, any>);
        
        // Seulement mettre à jour l'adresse si elle a au moins une propriété
        if (Object.keys(cleanAddress).length > 0) {
          acc[key] = cleanAddress;
        }
      } else {
        acc[key] = value;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // S'assurer que photo et photoURL sont synchronisés
    if (cleanedUpdates.photo && !cleanedUpdates.photoURL) {
      cleanedUpdates.photoURL = cleanedUpdates.photo;
    } else if (cleanedUpdates.photoURL && !cleanedUpdates.photo) {
      cleanedUpdates.photo = cleanedUpdates.photoURL;
    }
    
    // Préparer les données de mise à jour
    const updateData = {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(employeeRef, updateData);
    console.log(`Employé ${employeeId} mis à jour avec succès avec les données:`, updateData);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    return false;
  }
};

/**
 * Crée un nouvel employé
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<boolean> => {
  try {
    if (!employeeData.id) {
      console.error("Erreur: ID d'employé manquant dans les données");
      return false;
    }
    
    console.log(`Tentative de création de l'employé avec ID: ${employeeData.id}`);
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeData.id);
    
    // Ajouter les timestamps
    const dataWithTimestamps = {
      ...employeeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(employeeRef, dataWithTimestamps);
    console.log(`Employé ${employeeData.id} créé avec succès`);
    toast.success("Employé créé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    toast.error("Erreur lors de la création de l'employé");
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
    
    console.log(`Tentative de récupération de l'employé avec ID: ${employeeId}`);
    console.log("Collection path:", COLLECTIONS.HR.EMPLOYEES);
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé dans la collection ${COLLECTIONS.HR.EMPLOYEES}`);
      return null;
    }
    
    const employeeData = employeeDoc.data();
    console.log(`Employé ${employeeId} trouvé avec succès`);
    
    // S'assurer que photo et photoURL sont synchronisés
    if (employeeData.photo && !employeeData.photoURL) {
      employeeData.photoURL = employeeData.photo;
    } else if (employeeData.photoURL && !employeeData.photo) {
      employeeData.photo = employeeData.photoURL;
    }
    
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
    if (!employeeId) {
      console.error("ID d'employé non fourni pour la vérification");
      return false;
    }
    
    console.log(`Vérification de l'existence de l'employé avec ID: ${employeeId}`);
    console.log("Collection path:", COLLECTIONS.HR.EMPLOYEES);
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    const exists = employeeDoc.exists();
    console.log(`Employé ${employeeId} existe: ${exists}`);
    
    if (!exists) {
      console.error(`Employé avec ID ${employeeId} non trouvé dans la collection ${COLLECTIONS.HR.EMPLOYEES}`);
    }
    
    return exists;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de l'employé:", error);
    return false;
  }
};

/**
 * Vérifie si un email est déjà utilisé
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    if (!email) {
      console.error("Email non fourni pour la vérification");
      return false;
    }
    
    console.log(`Vérification si l'email ${email} est déjà utilisé`);
    
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    
    let emailExists = false;
    
    employeesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email === email || data.professionalEmail === email) {
        emailExists = true;
      }
    });
    
    console.log(`Email ${email} existe: ${emailExists}`);
    return emailExists;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de l'email:", error);
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
