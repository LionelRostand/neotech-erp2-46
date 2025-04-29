
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BadgeData } from '../badges/BadgeTypes';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Fetch badges from Firebase
 */
export const getBadges = async (): Promise<BadgeData[]> => {
  try {
    const badgesCollection = collection(db, COLLECTIONS.HR.BADGES);
    const snapshot = await getDocs(badgesCollection);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BadgeData[];
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

/**
 * Add a new badge to Firebase
 */
export const addBadge = async (badgeData: BadgeData): Promise<BadgeData> => {
  try {
    const badgesCollection = collection(db, COLLECTIONS.HR.BADGES);
    const { id, ...dataWithoutId } = badgeData;
    const docRef = await addDoc(badgesCollection, {
      ...dataWithoutId,
      createdAt: new Date().toISOString()
    });
    
    return {
      ...badgeData,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error adding badge:', error);
    throw error;
  }
};

/**
 * Delete a document from a specified collection
 */
export const deleteDocument = async (collectionPath: string, documentId: string) => {
  try {
    // Handle nested collection paths (e.g., "HR.BADGES")
    const actualPath = collectionPath.includes('.') 
      ? collectionPath.split('.').reduce(
          (path, segment) => path + (COLLECTIONS[segment] || segment) + '/', 
          ''
        ).slice(0, -1) // Remove trailing slash
      : COLLECTIONS[collectionPath] || collectionPath;
    
    const documentRef = doc(db, actualPath, documentId);
    await deleteDoc(documentRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionPath}:`, error);
    throw error;
  }
};
