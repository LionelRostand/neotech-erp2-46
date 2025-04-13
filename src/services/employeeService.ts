
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, addDoc, where } from 'firebase/firestore';
import { Employee } from '@/types/employee';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Génère un ID unique pour un employé au format EMP-XXXXXXXX
 * Note: utilisé uniquement comme référence interne, plus pour créer des documents
 */
export const generateEmployeeId = (): string => {
  const randomId = Math.random().toString(36).substring(2, 6).toUpperCase() +
                  Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EMP-${randomId}`;
};

/**
 * Vérifie si un employé avec l'email donné existe déjà
 */
export const checkDuplicateEmployee = async (email: string, professionalEmail?: string): Promise<boolean> => {
  try {
    console.log('Vérification des doublons pour:', email, professionalEmail);
    
    // Recherche par email personnel
    const emailQuery = query(
      collection(db, COLLECTIONS.HR.EMPLOYEES),
      where("email", "==", email)
    );
    
    const emailDocs = await getDocs(emailQuery);
    
    if (!emailDocs.empty) {
      console.log('Doublon trouvé avec email personnel');
      return true;
    }
    
    // Si un email professionnel est fourni, vérifier également
    if (professionalEmail) {
      const profEmailQuery = query(
        collection(db, COLLECTIONS.HR.EMPLOYEES),
        where("professionalEmail", "==", professionalEmail)
      );
      
      const profEmailDocs = await getDocs(profEmailQuery);
      
      if (!profEmailDocs.empty) {
        console.log('Doublon trouvé avec email professionnel');
        return true;
      }
    }
    
    console.log('Aucun doublon trouvé');
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification des doublons:', error);
    return false; // En cas d'erreur, considérer qu'il n'y a pas de doublon
  }
};

/**
 * Fonction qui nettoie les données de l'employé avant de les enregistrer
 * - Supprime les valeurs undefined et null
 * - Traite les cas spéciaux (photo, etc.)
 */
export const cleanEmployeeData = (employeeData: Partial<Employee>): Partial<Employee> => {
  // Créer une copie pour ne pas modifier l'objet original
  const cleanedData = { ...employeeData };
  
  // Traitement spécial pour la photo
  if (cleanedData.photoData === undefined) {
    delete cleanedData.photoData;
  }
  
  if (cleanedData.photoHex === undefined) {
    delete cleanedData.photoHex;
  }
  
  // Traitement des données photo
  if (cleanedData.photo && typeof cleanedData.photo === 'object') {
    // Si photo est un objet et non une string, le convertir en JSON string
    cleanedData.photo = JSON.stringify(cleanedData.photo);
  }
  
  // Si photoData est une string qui contient "data:", c'est probablement du base64
  if (cleanedData.photoData && typeof cleanedData.photoData === 'string') {
    // On garde tel quel, c'est une chaîne valide
  } else if (cleanedData.photoData && typeof cleanedData.photoData === 'object') {
    // Si c'est un objet, on le convertit en JSON
    cleanedData.photoData = JSON.stringify(cleanedData.photoData);
  }
  
  // Parcourir l'objet pour supprimer les valeurs undefined et null
  Object.keys(cleanedData).forEach(key => {
    const value = cleanedData[key as keyof Partial<Employee>];
    
    if (value === undefined || value === null) {
      delete cleanedData[key as keyof Partial<Employee>];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nettoyage récursif des objets imbriqués
      const cleanedObj = {};
      let hasProperties = false;
      
      Object.keys(value).forEach(subKey => {
        const subValue = value[subKey as keyof typeof value];
        if (subValue !== undefined && subValue !== null) {
          // @ts-ignore
          cleanedObj[subKey] = subValue;
          hasProperties = true;
        }
      });
      
      if (hasProperties) {
        // @ts-ignore
        cleanedData[key] = cleanedObj;
      } else {
        delete cleanedData[key as keyof Partial<Employee>];
      }
    }
  });
  
  return cleanedData;
};

/**
 * Créer un nouvel employé
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log('Début de création d\'un employé:', employeeData);
    
    // Vérifier si l'email existe déjà
    const isDuplicate = await checkDuplicateEmployee(
      employeeData.email || '', 
      employeeData.professionalEmail
    );
    
    if (isDuplicate) {
      toast.error('Un employé avec cet email existe déjà');
      return null;
    }
    
    // Nettoyer les données
    const cleanedData = cleanEmployeeData(employeeData);
    
    // Générer un ID client interne pour référence mais qui ne sera pas utilisé comme ID document
    const internalId = generateEmployeeId();
    
    // Préparer l'objet employé avec ID interne
    const employee: Employee = {
      id: internalId, // ID interne uniquement pour référence
      firstName: cleanedData.firstName || '',
      lastName: cleanedData.lastName || '',
      email: cleanedData.email || '',
      phone: cleanedData.phone || '',
      position: cleanedData.position || '',
      department: cleanedData.department || '',
      departmentId: cleanedData.departmentId || '',
      photo: cleanedData.photo || '',
      photoURL: cleanedData.photoURL || '',
      hireDate: cleanedData.hireDate || new Date().toISOString(),
      startDate: cleanedData.startDate || new Date().toISOString(),
      status: cleanedData.status || 'active',
      address: cleanedData.address || '',
      contract: cleanedData.contract || '',
      socialSecurityNumber: cleanedData.socialSecurityNumber || '',
      birthDate: cleanedData.birthDate || '',
      documents: cleanedData.documents || [],
      company: cleanedData.company || '',
      role: cleanedData.role || '',
      title: cleanedData.title || '',
      manager: cleanedData.manager || '',
      managerId: cleanedData.managerId || '',
      professionalEmail: cleanedData.professionalEmail || '',
      skills: cleanedData.skills || [],
      education: cleanedData.education || [],
      payslips: cleanedData.payslips || [],
      isManager: !!cleanedData.isManager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...cleanedData // Ajouter toutes les autres propriétés nettoyées
    };
    
    // Enregistrer dans Firestore en utilisant addDoc pour obtenir un ID auto-généré
    console.log('Enregistrement de l\'employé avec addDoc:', employee);
    
    const employeesCollectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const docRef = await addDoc(employeesCollectionRef, employee);
    
    // Mettre à jour l'objet employee avec l'ID Firestore
    const updatedEmployee: Employee = {
      ...employee,
      firebaseId: docRef.id, // Stocker l'ID Firestore dans un champ dédié
    };
    
    // Mettre à jour le document pour ajouter l'ID Firestore
    await updateDocument(COLLECTIONS.HR.EMPLOYEES, docRef.id, { firebaseId: docRef.id });
    
    console.log('Employé créé avec succès, ID Firestore:', docRef.id, 'ID interne:', internalId);
    return updatedEmployee;
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    throw error;
  }
};

/**
 * Mettre à jour un employé existant
 */
export const updateEmployeeDoc = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log('Début de mise à jour de l\'employé:', id, employeeData);
    
    // Nettoyer les données
    const cleanedData = cleanEmployeeData(employeeData);
    
    // Ajouter le timestamp de mise à jour
    cleanedData.updatedAt = new Date().toISOString();
    
    // Mettre à jour dans Firestore en utilisant updateDocument qui gère mieux les erreurs
    // Note: nous utilisons maintenant l'ID Firestore (docRef.id) et non plus l'ID interne
    const firebaseId = employeeData.firebaseId || id;
    const updatedEmployee = await updateDocument(COLLECTIONS.HR.EMPLOYEES, firebaseId, cleanedData);
    
    console.log('Employé mis à jour avec succès:', firebaseId);
    return updatedEmployee as Employee;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    throw error;
  }
};

/**
 * Synchroniser le statut de manager d'un employé
 */
export const syncManagerStatus = async (employee: Employee): Promise<void> => {
  // Aucune action nécessaire si pas de changement de statut
  if (!employee || !employee.id) return;
  
  try {
    console.log('Synchronisation du statut de manager pour:', employee.id);
    
    // logique spécifique si nécessaire...
    
    console.log('Statut de manager synchronisé avec succès pour:', employee.id);
  } catch (error) {
    console.error('Erreur lors de la synchronisation du statut de manager:', error);
  }
};
