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
