
import { 
  QueryConstraint,
  Timestamp,
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Function to handle network connectivity
export const reconnectToFirestore = async (enableNetworkFn: Function) => {
  try {
    await enableNetworkFn(db);
    console.log('Reconnected to Firestore');
    return true;
  } catch (err) {
    console.error('Failed to reconnect to Firestore:', err);
    return false;
  }
};

// Helper to get a collection reference
export const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

// Helper to get a document reference
export const getDocRef = (collectionName: string, id: string) => {
  return doc(db, collectionName, id);
};

// Get all documents from a collection with constraints
export const getAllDocuments = async (
  collectionName: string, 
  constraints?: QueryConstraint[]
) => {
  const collectionRef = getCollectionRef(collectionName);
  const q = constraints ? query(collectionRef, ...constraints) : query(collectionRef);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get a single document by ID
export const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = getDocRef(collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Format document with timestamps
export const formatDocumentWithTimestamps = (data: DocumentData) => {
  return {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
};

// Update document with timestamp
export const updateDocumentWithTimestamp = (data: DocumentData) => {
  return {
    ...data,
    updatedAt: Timestamp.now()
  };
};
