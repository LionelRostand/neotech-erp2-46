
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { TimeReport } from '@/types/timesheet';

// Get all timesheets
export const getTimeSheets = async (): Promise<TimeReport[]> => {
  try {
    const timeSheetCollectionRef = collection(db, COLLECTIONS.HR.TIMESHEET);
    const querySnapshot = await getDocs(timeSheetCollectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TimeReport));
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
};

// Get a specific timesheet by ID
export const getTimeSheet = async (id: string): Promise<TimeReport | null> => {
  try {
    const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
    const docSnap = await getDoc(timeSheetRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as TimeReport;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching timesheet with ID ${id}:`, error);
    throw error;
  }
};

// Add a new timesheet
export const addTimeSheet = async (data: any): Promise<boolean> => {
  try {
    // Format data for firestore
    const timesheetData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      lastUpdateText: `Créée le ${new Date().toLocaleDateString('fr-FR')}`
    };
    
    // Add the document to Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.TIMESHEET), timesheetData);
    
    console.log("Timesheet created with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding timesheet:", error);
    return false;
  }
};

// Update an existing timesheet
export const updateTimeSheet = async (id: string, data: Partial<TimeReport>): Promise<boolean> => {
  try {
    const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
    
    // Update the document
    await updateDoc(timeSheetRef, {
      ...data,
      updatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      lastUpdateText: `Mise à jour le ${new Date().toLocaleDateString('fr-FR')}`
    });
    
    console.log("Timesheet updated successfully:", id);
    return true;
  } catch (error) {
    console.error("Error updating timesheet:", error);
    return false;
  }
};

// Delete a timesheet
export const deleteTimeSheet = async (id: string): Promise<boolean> => {
  try {
    const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
    
    // Delete the document
    await deleteDoc(timeSheetRef);
    
    console.log("Timesheet deleted successfully:", id);
    return true;
  } catch (error) {
    console.error("Error deleting timesheet:", error);
    return false;
  }
};
