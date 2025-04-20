
import { doc, getDoc, collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Récupère un document par son ID
 * @param collectionPath Chemin de la collection
 * @param docId ID du document
 * @returns Le document ou null s'il n'existe pas
 */
export const getDocumentById = async (collectionPath: string, docId: string) => {
  try {
    // Vérifier que les paramètres sont valides
    if (!collectionPath || !docId) {
      console.error('Collection path ou document ID manquant', { collectionPath, docId });
      throw new Error('Collection path et document ID sont requis');
    }
    
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log(`Aucun document trouvé avec l'ID ${docId} dans ${collectionPath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
};

/**
 * Récupère tous les documents d'une collection
 * @param collectionPath Chemin de la collection
 * @param constraints Contraintes de requête (optionnelles)
 * @returns Liste des documents
 */
export const getAllDocuments = async (collectionPath: string, constraints: QueryConstraint[] = []) => {
  try {
    // Vérifier que le chemin est valide
    if (!collectionPath) {
      console.error('Collection path manquant');
      throw new Error('Collection path est requis');
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting all documents from ${collectionPath}:`, error);
    throw error;
  }
};
