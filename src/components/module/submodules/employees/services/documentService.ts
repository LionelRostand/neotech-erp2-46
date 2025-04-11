
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Employee, Document } from '@/types/employee';
import { getEmployee } from './employeeService'; // Import the getEmployee function

// Define EmployeeDocument type for consistent usage
export interface EmployeeDocument extends Document {
  id: string;
  name: string;
  type: string;
  date: string;
  fileUrl: string;
  uploadedAt?: any;
}

/**
 * Vérifie si un employé existe dans la base de données
 */
export const checkEmployeeExists = async (employeeId: string): Promise<boolean> => {
  try {
    if (!employeeId) {
      console.error("ID d'employé non fourni pour la vérification");
      return false;
    }
    
    console.log(`Vérification de l'existence de l'employé avec ID: ${employeeId}`);
    
    // Gérer le cas des IDs non persistés (employés récemment ajoutés)
    if (employeeId.startsWith('EMP') && !isNaN(parseInt(employeeId.slice(3)))) {
      // Pour les IDs générés par le frontend comme EMP4896,
      // vérifier s'il existe des employés dans la liste en mémoire
      console.log("ID d'employé au format EMP détecté, utilisation de la recherche alternative");
      
      // Utiliser la fonction getEmployee si elle est disponible pour chercher par ID
      try {
        const employee = await getEmployee(employeeId);
        const exists = !!employee;
        console.log(`Employé ${employeeId} trouvé par recherche alternative: ${exists}`);
        return exists;
      } catch (e) {
        console.warn("Échec de la recherche alternative:", e);
        // Continuer avec la méthode standard
      }
    }
    
    // Utiliser explicitement le chemin complet de la collection
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const docSnap = await getDoc(docRef);
    
    const exists = docSnap.exists();
    console.log(`Employé ${employeeId} existe: ${exists}`);
    
    // Afficher plus d'informations de débogage si l'employé n'existe pas
    if (!exists) {
      console.error(`Employé avec ID ${employeeId} non trouvé dans la collection ${COLLECTIONS.HR.EMPLOYEES}`);
      console.log("Collection path:", COLLECTIONS.HR.EMPLOYEES);
    }
    
    return exists;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'employé ID ${employeeId}:`, error);
    return false;
  }
};

/**
 * Récupère tous les documents d'un employé
 */
export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return [];
    }
    
    const employee = docSnap.data() as Employee;
    
    if (!employee.documents || !Array.isArray(employee.documents)) {
      return [];
    }
    
    return employee.documents as EmployeeDocument[];
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    return [];
  }
};

/**
 * Téléverse un document pour un employé
 */
export const uploadEmployeeDocument = async (
  employeeId: string,
  file: File,
  documentName: string,
  documentType: string
): Promise<boolean> => {
  try {
    console.log(`Début du téléversement de document pour l'employé ID: ${employeeId}`);
    
    // Vérifier d'abord si l'employé existe
    const employeeExists = await checkEmployeeExists(employeeId);
    
    if (!employeeExists) {
      console.error(`Employé avec ID ${employeeId} non trouvé lors du téléversement de document`);
      return false;
    }
    
    console.log(`Employé ${employeeId} trouvé, téléversement du document en cours...`);
    
    // Générer un ID unique pour le document
    const documentId = uuidv4();
    
    // Référence au fichier dans le stockage
    const storageRef = ref(storage, `employees/${employeeId}/documents/${documentId}_${file.name}`);
    
    // Ajouter des métadonnées CORS
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Cache-Control': 'public, max-age=31536000'
      }
    };
    
    // Téléversement du fichier avec métadonnées
    const uploadResult = await uploadBytes(storageRef, file, metadata);
    
    // Obtenir l'URL de téléchargement
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Date actuelle pour le document
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    // Données du document
    const documentData = {
      id: documentId,
      name: documentName,
      type: documentType,
      date: currentDate,
      fileUrl: downloadURL,
      uploadedAt: serverTimestamp()
    };
    
    // Ajouter le document à l'employé
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    await updateDoc(employeeRef, {
      documents: arrayUnion(documentData),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Document ${documentName} ajouté à l'employé ${employeeId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors du téléversement du document:", error);
    return false;
  }
};

/**
 * Supprime un document d'un employé
 */
export const deleteEmployeeDocument = async (
  documentId: string,
  employeeId: string
): Promise<boolean> => {
  try {
    // Obtenir l'employé
    const employee = await getEmployee(employeeId);
    
    if (!employee) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return false;
    }
    
    if (!employee.documents || !Array.isArray(employee.documents)) {
      console.error(`Documents non trouvés pour l'employé ${employeeId}`);
      return false;
    }
    
    // Trouver le document à supprimer
    const documentToDelete = employee.documents.find(doc => 
      typeof doc === 'object' && doc.id === documentId
    );
    
    if (!documentToDelete) {
      console.error(`Document avec ID ${documentId} non trouvé`);
      return false;
    }
    
    // Supprimer le fichier du stockage si fileUrl existe
    if (documentToDelete.fileUrl) {
      try {
        const fileRef = ref(storage, documentToDelete.fileUrl);
        await deleteObject(fileRef);
      } catch (error) {
        console.warn("Erreur lors de la suppression du fichier de stockage:", error);
        // Continue even if file deletion fails
      }
    }
    
    // Mettre à jour l'employé pour supprimer le document
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    await updateDoc(employeeRef, {
      documents: arrayRemove(documentToDelete),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Document ${documentId} supprimé de l'employé ${employeeId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    return false;
  }
};
