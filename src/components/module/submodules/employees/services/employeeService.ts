import { db, storage } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  arrayUnion,
  collection,
  getDocs,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee, EmployeeAddress } from '@/types/employee';
import { toast } from 'sonner';

/**
 * Téléverse la photo de profil d'un employé
 */
export const uploadEmployeePhoto = async (employeeId: string, file: File): Promise<string> => {
  try {
    console.log(`Début du téléversement de photo pour l'employé ${employeeId}`);
    
    // Check if employee exists
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé dans la collection ${COLLECTIONS.HR.EMPLOYEES}`);
      throw new Error(`Employé avec ID ${employeeId} non trouvé`);
    }
    
    // Generate a unique name for the photo
    const photoName = `photo_${Date.now()}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `employees/${employeeId}/photos/${photoName}`);
    
    // Upload the photo to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Update the employee record with the new photo URL
    await updateDoc(employeeRef, {
      photoURL: downloadURL,
      photo: downloadURL, // For backward compatibility
      updatedAt: serverTimestamp()
    });
    
    // Add photo to documents collection
    const docRef = doc(collection(db, COLLECTIONS.HR.DOCUMENTS));
    await setDoc(docRef, {
      employeeId: employeeId,
      name: `Photo de profil (${new Date().toLocaleDateString('fr-FR')})`,
      type: 'photo',
      date: new Date().toISOString(),
      fileUrl: downloadURL,
      uploadedAt: serverTimestamp()
    });
    
    console.log(`Photo téléversée avec succès: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors du téléversement de la photo:', error);
    throw error;
  }
};

/**
 * Récupère les données d'un employé
 */
export const getEmployee = async (employeeId: string): Promise<Employee | null> => {
  try {
    console.log(`Récupération de l'employé avec ID: ${employeeId}`);
    
    // Si l'ID commence par "EMP", il peut s'agir d'un ID généré côté client
    if (employeeId.startsWith('EMP') && !isNaN(parseInt(employeeId.slice(3)))) {
      console.log("ID client détecté, recherche sur tous les employés");
      
      // Essayer d'abord de récupérer par ID exact
      const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const employeeData = docSnap.data() as Employee;
        return { id: docSnap.id, ...employeeData };
      }
      
      // Si non trouvé, récupérer tous les employés pour vérifier
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const querySnapshot = await getDocs(employeesRef);
      
      // Recherche par correspondance avec les propriétés id ou userId
      const employee = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return doc.id === employeeId || data.id === employeeId || data.userId === employeeId;
      });
      
      if (employee) {
        return { id: employee.id, ...employee.data() as Employee };
      }
      
      console.warn(`Employé ${employeeId} non trouvé dans la collection`);
      return null;
    }
    
    // Récupération standard par ID
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const employeeData = docSnap.data() as Employee;
      return { id: docSnap.id, ...employeeData };
    } else {
      console.warn(`Employé ${employeeId} non trouvé`);
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${employeeId}:`, error);
    return null;
  }
};

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
    console.log("Données de mise à jour:", updates);
    
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
          if (addrVal !== undefined && addrVal !== null) {
            addrAcc[addrKey] = addrVal;
          }
          return addrAcc;
        }, {} as Record<string, any>);
        
        // S'assurer que les champs requis sont présents
        if (!cleanAddress.street) cleanAddress.street = '';
        if (!cleanAddress.city) cleanAddress.city = '';
        if (!cleanAddress.postalCode) cleanAddress.postalCode = '';
        if (!cleanAddress.country) cleanAddress.country = 'France';
        
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
    
    console.log("Données nettoyées pour mise à jour:", updateData);
    
    await updateDoc(employeeRef, updateData);
    console.log(`Employé ${employeeId} mis à jour avec succès avec les données:`, updateData);
    
    // Récupérer et retourner l'employé mis à jour pour confirmation
    const updatedEmployeeDoc = await getDoc(employeeRef);
    if (updatedEmployeeDoc.exists()) {
      console.log("Document mis à jour:", updatedEmployeeDoc.data());
    }
    
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
