
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BadgeData } from '../badges/BadgeTypes';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Fetch badges from Firebase
 */
export const getBadges = async (): Promise<BadgeData[]> => {
  try {
    // Use the correct path from COLLECTIONS
    const badgesCollection = collection(db, COLLECTIONS.HR.BADGES);
    const snapshot = await getDocs(badgesCollection);
    
    // Ensure we return an array even if there are no documents
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BadgeData[];
  } catch (error) {
    console.error('Error fetching badges:', error);
    // Return an empty array instead of throwing an error to prevent the "cannot read properties of undefined" error
    return [];
  }
};

/**
 * Add a new badge to Firebase
 */
export const addBadge = async (badgeData: BadgeData): Promise<BadgeData> => {
  try {
    // Use the correct path from COLLECTIONS
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
    let actualPath = collectionPath;

    // Check if it's a nested path using dot notation
    if (collectionPath && collectionPath.includes('.')) {
      const segments = collectionPath.split('.');
      // Handle HR.BADGES by accessing COLLECTIONS.HR.BADGES
      if (segments.length === 2 && 
          COLLECTIONS[segments[0]] && 
          COLLECTIONS[segments[0]][segments[1]]) {
        actualPath = COLLECTIONS[segments[0]][segments[1]];
      }
    } else if (COLLECTIONS[collectionPath]) {
      // Handle direct top-level collections
      actualPath = COLLECTIONS[collectionPath];
    }
    
    const documentRef = doc(db, actualPath, documentId);
    await deleteDoc(documentRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionPath}:`, error);
    throw error;
  }
};
