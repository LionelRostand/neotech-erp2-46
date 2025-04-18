
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Fonction pour générer un ID court et unique
const generateShortId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const addDocument = async (collectionPath: string, data: any) => {
  try {
    // Générer un ID court pour le nouveau document
    const shortId = generateShortId();
    
    console.log(`Adding document to collection: ${collectionPath} with ID: ${shortId}`, data);
    
    // Préparer les données avec l'ID court
    const documentData = {
      ...data,
      id: shortId // Assigner l'ID court
    };
    
    // Vérifier si l'objet contient des champs d'image
    if (data.photo || data.photoURL || data.photoData) {
      console.log('Le document contient des données d\'image, s\'assurant qu\'elles sont correctement stockées');
      
      const photoData = data.photoData || data.photo || data.photoURL || '';
      
      if (photoData && typeof photoData === 'string') {
        documentData.photo = photoData;
        documentData.photoURL = photoData;
        documentData.photoData = photoData;
      }
    }
    
    // Utiliser setDoc avec l'ID généré
    const docRef = doc(db, collectionPath, shortId);
    await setDoc(docRef, documentData);
    
    console.log(`Document set successfully with ID: ${shortId}`);
    return documentData;
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    toast.error(`Erreur lors de l'ajout du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};

/**
 * Add a document to the trainings collection
 * @param data The training data
 * @returns A promise that resolves with the document reference
 */
export const addTrainingDocument = async (data: any) => {
  return await addDocument(COLLECTIONS.HR.TRAININGS, data);
};

/**
 * Set a document in a collection with a specific ID
 * @param collectionPath The collection path
 * @param id The document ID
 * @param data The document data
 * @returns A promise that resolves when the operation is complete
 */
export const setDocument = async (collectionPath: string, id: string, data: any) => {
  try {
    console.log(`Setting document in collection: ${collectionPath} with ID: ${id}`, data);
    const docRef = doc(db, collectionPath, id);
    await setDoc(docRef, data);
    console.log(`Document set successfully with ID: ${id}`);
    return { id, ...data };
  } catch (error) {
    console.error(`Error setting document in ${collectionPath} with ID ${id}:`, error);
    toast.error(`Erreur lors de la définition du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};
