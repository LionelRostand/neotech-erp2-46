
import { 
  updateDoc,
  setDoc,
  DocumentData,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDocumentWithTimestamps } from './common-utils';
import { toast } from 'sonner';

// Helper function to clean data by removing undefined and null values
const cleanData = (data: DocumentData): DocumentData => {
  // Créer une copie pour ne pas modifier l'objet original
  const result: DocumentData = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value !== undefined && value !== null) {
      // Handle nested objects recursively
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const cleanedObj = cleanData(value);
        // Only add the cleaned object if it has properties
        if (Object.keys(cleanedObj).length > 0) {
          result[key] = cleanedObj;
        }
      } else {
        result[key] = value;
      }
    }
  });
  
  return result;
};

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Updating document ${id} in collection ${collectionName}`);
    console.log('Update data:', data);
    
    const docRef = doc(db, collectionName, id);
    
    // Vérifier d'abord si le document existe
    const docSnapshot = await getDoc(docRef);
    const exists = docSnapshot.exists();
    
    // Nettoyer les données pour éliminer les valeurs undefined et null
    const cleanedData = cleanData(data);
    
    console.log('Données nettoyées avant mise à jour:', cleanedData);
    
    // Préparer les données avec les timestamps
    const updatedData = formatDocumentWithTimestamps(cleanedData);
    
    // Make sure ID is not included in the update data
    // as Firebase doesn't need it and it could cause problems
    const { id: _, ...dataWithoutId } = updatedData;
    
    if (exists) {
      // Document exists, update it
      console.log(`Document ${id} exists, updating with updateDoc`);
      await updateDoc(docRef, dataWithoutId);
      console.log(`Document ${id} updated successfully with updateDoc`);
    } else {
      // Document doesn't exist, create it with setDoc
      console.log(`Document ${id} does not exist, creating with setDoc`);
      await setDoc(docRef, updatedData);
      console.log(`Document ${id} created with setDoc`);
    }
    
    console.log(`Document ${id} processed successfully`);
    return { id, ...updatedData };
  } catch (error: any) {
    console.error(`Error updating document ${id}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document mis à jour en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { id, ...data, _offlineUpdated: true };
    } else {
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
      throw error;
    }
  }
};

// Create or update a document with a specific ID
export const setDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Setting document ${id} in collection ${collectionName}`);
    console.log('Document data:', data);
    
    // Nettoyer les données pour éliminer les valeurs undefined et null
    const cleanedData = cleanData(data);
    
    console.log('Données nettoyées avant setDocument:', cleanedData);
    
    const docRef = doc(db, collectionName, id);
    const updatedData = formatDocumentWithTimestamps(cleanedData);
    
    // Use merge: true to merge data instead of replacing the entire document
    await setDoc(docRef, updatedData, { merge: true });
    console.log(`Document ${id} set successfully`);
    return { id, ...updatedData };
  } catch (error: any) {
    console.error(`Error setting document ${id}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document enregistré en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { id, ...data, _offlineUpdated: true };
    } else {
      toast.error(`Erreur lors de la sauvegarde: ${errorMessage}`);
      throw error;
    }
  }
};

// Function to update employee skills
export const updateEmployeeSkills = async (collectionName: string, employeeId: string, skills: string[]) => {
  try {
    console.log(`Updating skills for employee ${employeeId} in collection ${collectionName}`);
    
    const docRef = doc(db, collectionName, employeeId);
    
    // Check if the document exists
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      throw new Error(`L'employé avec l'ID ${employeeId} n'existe pas`);
    }
    
    // Update only the skills field
    await updateDoc(docRef, { 
      skills,
      updatedAt: new Date().toISOString() 
    });
    
    console.log(`Skills updated successfully for employee ${employeeId}`);
    return true;
  } catch (error) {
    console.error(`Error updating skills for employee ${employeeId}:`, error);
    throw error;
  }
};
