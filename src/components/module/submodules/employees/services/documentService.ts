
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Employee } from '@/types/employee';
import { getEmployee } from './employeeService';

/**
 * Vérifie si un employé existe dans la base de données
 */
export const checkEmployeeExists = async (employeeId: string): Promise<boolean> => {
  try {
    if (!employeeId) {
      console.error("ID d'employé non fourni pour la vérification");
      return false;
    }
    
    // Utiliser la fonction getEmployee du service employé
    const employee = await getEmployee(employeeId);
    return employee !== null;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'employé ID ${employeeId}:`, error);
    return false;
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
    // Vérifier d'abord si l'employé existe
    const employeeExists = await checkEmployeeExists(employeeId);
    
    if (!employeeExists) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      return false;
    }
    
    // Générer un ID unique pour le document
    const documentId = uuidv4();
    
    // Référence au fichier dans le stockage
    const storageRef = ref(storage, `employees/${employeeId}/documents/${documentId}_${file.name}`);
    
    // Téléversement du fichier
    const uploadResult = await uploadBytes(storageRef, file);
    
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
  employeeId: string,
  documentId: string
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
    
    // Filtrer les documents pour retirer celui à supprimer
    const updatedDocuments = employee.documents.filter(doc => 
      doc.id !== documentId && typeof doc === 'object'
    );
    
    // Mettre à jour l'employé
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    await updateDoc(employeeRef, {
      documents: updatedDocuments,
      updatedAt: serverTimestamp()
    });
    
    // Note: Nous ne supprimons pas le fichier du stockage pour l'instant
    // Cela pourrait être ajouté ultérieurement
    
    console.log(`Document ${documentId} supprimé de l'employé ${employeeId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    return false;
  }
};
