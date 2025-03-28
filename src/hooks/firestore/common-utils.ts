
import { 
  collection, 
  doc, 
  CollectionReference, 
  DocumentReference,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get a Firestore collection reference
export const getCollectionRef = (collectionPath: string): CollectionReference => {
  return collection(db, collectionPath);
};

// Get a Firestore document reference
export const getDocRef = (collectionPath: string, docId: string): DocumentReference => {
  return doc(db, collectionPath, docId);
};

// Format document data with timestamps for created/updated timestamps
export const formatDocumentWithTimestamps = (data: any) => {
  const now = serverTimestamp();
  return {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: now
  };
};

// Convert Firestore timestamps to Date objects
export const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const result = { ...data };
  
  Object.keys(result).forEach(key => {
    // Convert Timestamp to Date
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
    // Recursively convert nested objects
    else if (result[key] && typeof result[key] === 'object') {
      result[key] = convertTimestamps(result[key]);
    }
  });
  
  return result;
};
