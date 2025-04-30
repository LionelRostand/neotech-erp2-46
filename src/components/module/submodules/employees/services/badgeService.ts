
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, setDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';
import { BadgeData } from '../badges/BadgeTypes';
import { Employee } from '@/types/employee';

export const getBadge = async (badgeId: string): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as BadgeData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching badge:", error);
    return null;
  }
};

export const createBadge = async (badgeData: BadgeData): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeData.id);
    await setDoc(docRef, badgeData);
    
    // Fetch the document to return the created badge data
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docRef.id, ...docData } as unknown as BadgeData;
    } else {
      console.log("No such document after creation!");
      return null;
    }
  } catch (error) {
    console.error("Error creating badge:", error);
    return null;
  }
};

export const updateBadge = async (badgeId: string, badgeData: Partial<BadgeData>): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    await setDoc(docRef, badgeData, { merge: true });
    
    // Fetch the document to return the updated badge data
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docRef.id, ...docData } as unknown as BadgeData;
    } else {
      console.log("No such document after update!");
      return null;
    }
  } catch (error) {
    console.error("Error updating badge:", error);
    return null;
  }
};

export const deleteBadge = async (badgeId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting badge:", error);
    return false;
  }
};

export const getAllBadges = async (): Promise<BadgeData[]> => {
  try {
    const badgesCollection = collection(db, COLLECTIONS.HR.BADGES);
    const badgesQuery = query(badgesCollection);
    const querySnapshot = await getDocs(badgesQuery);
    
    const badges: BadgeData[] = [];
    querySnapshot.forEach(doc => {
      badges.push({
        id: doc.id,
        ...doc.data()
      } as BadgeData);
    });
    
    return badges;
  } catch (error) {
    console.error("Error fetching all badges:", error);
    return [];
  }
};

// Aliases pour la compatibilité avec EmployeesBadges component
export const getBadges = getAllBadges;
export const addBadge = createBadge;

// Function to delete a document (used in EmployeesBadges.tsx)
export const deleteDocument = async (collectionPath: string, documentId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionPath, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionPath}:`, error);
    return false;
  }
};
