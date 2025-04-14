import { DocumentData, serverTimestamp } from "firebase/firestore";

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
