
import { db } from '@/lib/firebase';
import { doc, DocumentReference, collection, CollectionReference, Timestamp, DocumentData } from 'firebase/firestore';

/**
 * Get a reference to a document in Firestore
 * @param collectionName Collection path
 * @param docId Document ID
 * @returns DocumentReference
 */
export const getDocRef = (collectionName: string, docId: string): DocumentReference => {
  console.log(`Getting document reference for ${collectionName}/${docId}`);
  return doc(db, collectionName, docId);
};

/**
 * Get a reference to a collection in Firestore
 * @param collectionName Collection path
 * @returns CollectionReference
 */
export const getCollectionRef = (collectionName: string): CollectionReference => {
  console.log(`Getting collection reference for ${collectionName}`);
  return collection(db, collectionName);
};

/**
 * Generate a unique ID for documents
 * @returns Unique ID string
 */
export const generateDocId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Add timestamps (createdAt, updatedAt) to documents
 * @param data Document data
 * @returns Document data with timestamps
 */
export const formatDocumentWithTimestamps = (data: DocumentData): DocumentData => {
  const now = Timestamp.now();
  
  return {
    ...data,
    updatedAt: now,
    // Add createdAt only if it doesn't already exist
    ...(data.createdAt ? {} : { createdAt: now })
  };
};
