
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
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
    
    // Convertir le fichier en ArrayBuffer pour assurer un téléversement binaire correct
    const fileArrayBuffer = await file.arrayBuffer();
    
    // Ajouter des métadonnées CORS et spécifier le type de contenu correct
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'originalName': file.name,
        'documentType': documentType,
        'documentId': documentId
      }
    };
    
    // Téléversement du fichier avec métadonnées en tant que données binaires
    console.log(`Téléversement du fichier ${file.name} (${file.size} octets) en tant que données binaires...`);
    const uploadResult = await uploadBytes(storageRef, new Uint8Array(fileArrayBuffer), metadata);
    console.log('Téléversement réussi, résultat:', uploadResult);
    
    // Obtenir l'URL de téléchargement
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('URL de téléchargement obtenue:', downloadURL);
    
    // Date actuelle pour le document
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    // Données du document
    const documentData = {
      id: documentId,
      name: documentName,
      type: documentType,
      date: currentDate,
      fileUrl: downloadURL,
      uploadedAt: serverTimestamp(),
      fileSize: file.size,
      fileType: file.type
    };
    
    // Ajouter le document à l'employé
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    await updateDoc(employeeRef, {
      documents: arrayUnion(documentData),
      updatedAt: serverTimestamp()
    });
    
    // Également enregistrer ce document dans la collection hrDocuments pour la centralisation
    try {
      const hrDocRef = doc(db, COLLECTIONS.HR.DOCUMENTS, documentId);
      await setDoc(hrDocRef, {
        ...documentData,
        employeeId: employeeId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Document également ajouté à la collection centralisée HR_DOCUMENTS`);
    } catch (error) {
      console.warn("Erreur lors de l'ajout à la collection centralisée:", error);
      // Continue même en cas d'erreur pour ne pas bloquer le processus principal
    }
    
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
    
    // Supprimer également de la collection centralisée si elle existe
    try {
      const hrDocRef = doc(db, COLLECTIONS.HR.DOCUMENTS, documentId);
      await deleteDoc(hrDocRef);
      console.log(`Document également supprimé de la collection centralisée HR_DOCUMENTS`);
    } catch (error) {
      console.warn("Erreur lors de la suppression de la collection centralisée:", error);
      // Continue même en cas d'erreur
    }
    
    console.log(`Document ${documentId} supprimé de l'employé ${employeeId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    return false;
  }
};
