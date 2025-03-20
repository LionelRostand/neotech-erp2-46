
import { 
  QueryConstraint,
  query,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { getCollectionRef, getDocRef } from './common-utils';
import { executeWithNetworkRetry } from './network-handler';

// Get all documents from a collection with constraints
export const getAllDocuments = async (
  collectionName: string, 
  constraints?: QueryConstraint[]
) => {
  return executeWithNetworkRetry(async () => {
    const collectionRef = getCollectionRef(collectionName);
    const q = constraints ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
};

// Get a single document by ID
export const getDocumentById = async (collectionName: string, id: string) => {
  return executeWithNetworkRetry(async () => {
    const docRef = getDocRef(collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  });
};
