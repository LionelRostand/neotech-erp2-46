
import { DocumentData, serverTimestamp, doc, collection } from "firebase/firestore";
import { db } from '@/lib/firebase';

/**
 * Adds createdAt and updatedAt timestamp fields to a document
 * @param data The document data to format
 * @returns Document data with timestamps added
 */
export const formatDocumentWithTimestamps = (data: DocumentData): DocumentData => {
  const now = serverTimestamp();
  
  return {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: now
  };
};

/**
 * Transforms document data to ensure all fields are serializable for Firestore
 * @param data The document data to transform
 * @returns Transformed document data
 */
export const prepareDocumentData = (data: DocumentData): DocumentData => {
  const result: DocumentData = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined values
    if (value === undefined) return;
    
    // Handle null
    if (value === null) {
      result[key] = null;
      return;
    }
    
    // Handle Date objects
    if (value instanceof Date) {
      result[key] = value.toISOString();
      return;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      result[key] = value.map(item => {
        if (item instanceof Date) return item.toISOString();
        if (typeof item === 'object' && item !== null) return prepareDocumentData(item as DocumentData);
        return item;
      });
      return;
    }
    
    // Handle nested objects
    if (typeof value === 'object') {
      result[key] = prepareDocumentData(value as DocumentData);
      return;
    }
    
    // Primitives pass through unchanged
    result[key] = value;
  });
  
  return result;
};

/**
 * Gets a document reference in Firestore
 * @param collectionName The collection path
 * @param documentId The document ID
 * @returns Document reference
 */
export const getDocRef = (collectionName: string, documentId: string) => {
  return doc(db, collectionName, documentId);
};

/**
 * Gets a collection reference in Firestore
 * @param collectionPath The collection path
 * @returns Collection reference
 */
export const getCollectionRef = (collectionPath: string) => {
  return collection(db, collectionPath);
};

/**
 * Helper function to safely handle offline created documents
 * @param result The result returned from a Firestore operation
 * @returns The ID of the document, handling _offlineCreated case
 */
export const safelyGetDocumentId = (result: { id: string } | { _offlineCreated: boolean }): string | undefined => {
  if ('id' in result) {
    return result.id;
  } else if ('_offlineCreated' in result) {
    // For offline documents, return a temporary ID or undefined
    return undefined;
  }
  return undefined;
};
