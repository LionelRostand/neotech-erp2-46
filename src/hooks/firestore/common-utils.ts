
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

// Helper to get a collection reference
export const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

// Helper to get a document reference
export const getDocRef = (collectionName: string, id: string) => {
  return doc(db, collectionName, id);
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
