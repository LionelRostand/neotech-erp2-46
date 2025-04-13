
import { collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get a reference to a collection
 * @param collectionPath Path to the collection
 * @returns Collection reference
 */
export const getCollectionRef = (collectionPath: string) => {
  return collection(db, collectionPath);
};

/**
 * Format a document with timestamps for createdAt and updatedAt
 * @param data Document data
 * @returns Formatted document data
 */
export const formatDocumentWithTimestamps = (data: any) => {
  const now = new Date().toISOString();
  
  return {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: now
  };
};
