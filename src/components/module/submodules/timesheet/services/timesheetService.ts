
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'sonner';

export interface TimesheetEntry {
    id?: string;
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    task: string;
    notes?: string;
    breakDuration?: number;
}

const timesheetCollection = collection(db, COLLECTIONS.HR.TIMESHEET);

export const addTimesheetEntry = async (entry: TimesheetEntry) => {
    try {
        const docRef = await addDoc(timesheetCollection, entry);
        toast.success("Timesheet entry added successfully!");
        return docRef.id;
    } catch (error: any) {
        toast.error(`Failed to add timesheet entry: ${error.message}`);
        console.error("Error adding timesheet entry:", error);
        throw error;
    }
};

export const getTimesheetEntriesByEmployeeId = async (employeeId: string): Promise<TimesheetEntry[]> => {
    try {
        const q = query(timesheetCollection, where("employeeId", "==", employeeId));
        const querySnapshot = await getDocs(q);
        const entries: TimesheetEntry[] = [];
        querySnapshot.forEach((doc) => {
            entries.push({ id: doc.id, ...doc.data() } as TimesheetEntry);
        });
        return entries;
    } catch (error: any) {
        console.error("Error fetching timesheet entries:", error);
        toast.error(`Failed to fetch timesheet entries: ${error.message}`);
        return [];
    }
};

export const updateTimesheetEntry = async (id: string, updates: Partial<TimesheetEntry>) => {
    try {
        const entryDoc = doc(db, COLLECTIONS.HR.TIMESHEET, id);
        await updateDoc(entryDoc, updates);
        toast.success("Timesheet entry updated successfully!");
    } catch (error: any) {
        console.error("Error updating timesheet entry:", error);
        toast.error(`Failed to update timesheet entry: ${error.message}`);
        throw error;
    }
};

export const deleteTimesheetEntry = async (id: string) => {
    try {
        const entryDoc = doc(db, COLLECTIONS.HR.TIMESHEET, id);
        await deleteDoc(entryDoc);
        toast.success("Timesheet entry deleted successfully!");
    } catch (error: any) {
        console.error("Error deleting timesheet entry:", error);
        toast.error(`Failed to delete timesheet entry: ${error.message}`);
        throw error;
    }
};

// Add the missing functions for timesheet management
export const addTimeSheet = async (data: any) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.HR.TIMESHEET), data);
        return docRef.id;
    } catch (error: any) {
        console.error("Error adding timesheet:", error);
        toast.error(`Failed to add timesheet: ${error.message}`);
        return null;
    }
};

export const getAllTimeSheets = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.HR.TIMESHEET));
        const timeSheets: any[] = [];
        querySnapshot.forEach((doc) => {
            timeSheets.push({ id: doc.id, ...doc.data() });
        });
        return timeSheets;
    } catch (error: any) {
        console.error("Error fetching timesheets:", error);
        toast.error(`Failed to fetch timesheets: ${error.message}`);
        return [];
    }
};

export const approveTimeSheet = async (id: string) => {
    try {
        const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
        await updateDoc(timeSheetRef, {
            status: "Validé",
            approvedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            lastUpdateText: new Date().toLocaleDateString('fr-FR')
        });
        return true;
    } catch (error: any) {
        console.error("Error approving timesheet:", error);
        toast.error(`Failed to approve timesheet: ${error.message}`);
        return false;
    }
};

export const rejectTimeSheet = async (id: string) => {
    try {
        const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
        await updateDoc(timeSheetRef, {
            status: "Rejeté",
            rejectedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            lastUpdateText: new Date().toLocaleDateString('fr-FR')
        });
        return true;
    } catch (error: any) {
        console.error("Error rejecting timesheet:", error);
        toast.error(`Failed to reject timesheet: ${error.message}`);
        return false;
    }
};

export const submitTimeSheet = async (id: string) => {
    try {
        const timeSheetRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
        await updateDoc(timeSheetRef, {
            status: "Soumis",
            submittedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            lastUpdateText: new Date().toLocaleDateString('fr-FR')
        });
        return true;
    } catch (error: any) {
        console.error("Error submitting timesheet:", error);
        toast.error(`Failed to submit timesheet: ${error.message}`);
        return false;
    }
};
