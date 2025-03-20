
import { 
  DocumentData,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { getDocRef, updateDocumentWithTimestamp } from './common-utils';

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: DocumentData) => {
  const docRef = getDocRef(collectionName, id);
  const updatedData = updateDocumentWithTimestamp(data);
  
  await updateDoc(docRef, updatedData);
  return { id, ...updatedData };
};

// Create or update a document with a specific ID
export const setDocument = async (collectionName: string, id: string, data: DocumentData) => {
  const docRef = getDocRef(collectionName, id);
  const updatedData = updateDocumentWithTimestamp(data);
  
  await setDoc(docRef, updatedData, { merge: true });
  return { id, ...updatedData };
};
