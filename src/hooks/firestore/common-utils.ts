import { collection, doc, DocumentData, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get a reference to a Firestore collection
 * @param collectionPath The path to the collection
 * @returns A CollectionReference
 */
export const getCollectionRef = (collectionPath: string) => {
  return collection(db, collectionPath);
};

/**
 * Get a reference to a Firestore document
 * @param collectionPath The path to the collection
 * @param documentId The ID of the document
 * @returns A DocumentReference
 */
export const getDocRef = (collectionPath: string, documentId: string) => {
  return doc(db, collectionPath, documentId);
};

/**
 * Format a document with timestamps for Firestore
 * @param data The document data
 * @returns Formatted document data with timestamps
 */
export const formatDocumentWithTimestamps = (data: DocumentData): DocumentData => {
  // Add createdAt for new documents
  if (!data.createdAt) {
    data.createdAt = new Date();
  }
  
  // Always update updatedAt
  data.updatedAt = new Date();
  
  return data;
};

/**
 * Safely get document ID even for offline documents
 * @param record A document that might be offline or have an ID
 * @returns The document ID or a generated temporary ID
 */
export const safelyGetDocumentId = (record: { id: string } | { _offlineCreated: boolean }) => {
  if ('id' in record) {
    return record.id;
  }
  return 'temp-' + Date.now(); // Generate a temporary ID for offline records
};
