import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { BadgeData } from '@/components/module/submodules/employees/badges/BadgeTypes';

// Get all badges
export const getBadges = async (): Promise<BadgeData[]> => {
  try {
    const badgesCollectionRef = collection(db, COLLECTIONS.HR.BADGES);
    const querySnapshot = await getDocs(badgesCollectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BadgeData));
  } catch (error) {
    console.error("Error fetching badges:", error);
    throw error;
  }
};

// Add a new badge
export const addBadge = async (badgeData: Omit<BadgeData, 'id'>): Promise<BadgeData> => {
  try {
    const badgesCollectionRef = collection(db, COLLECTIONS.HR.BADGES);
    const docRef = await addDoc(badgesCollectionRef, {
      ...badgeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...badgeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error adding badge:", error);
    throw error;
  }
};

// Update an existing badge
export const updateBadge = async (id: string, badgeData: Partial<BadgeData>): Promise<void> => {
  try {
    const badgeRef = doc(db, COLLECTIONS.HR.BADGES, id);
    await updateDoc(badgeRef, {
      ...badgeData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating badge:", error);
    throw error;
  }
};

// Delete a badge - rename from deleteDocument to deleteBadge for consistency
export const deleteBadge = async (id: string): Promise<void> => {
  try {
    const badgeRef = doc(db, COLLECTIONS.HR.BADGES, id);
    await deleteDoc(badgeRef);
  } catch (error) {
    console.error("Error deleting badge:", error);
    throw error;
  }
};

// Keep the original function name as an alias for backward compatibility
export const deleteDocument = deleteBadge;
