
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Types for leave requests
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  durationDays?: number;
}

// Get all leave requests
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  try {
    const leaveRequestsCollectionRef = collection(db, COLLECTIONS.HR.LEAVE_REQUESTS);
    const querySnapshot = await getDocs(leaveRequestsCollectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeaveRequest));
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (employeeId: string): Promise<LeaveRequest[]> => {
  try {
    const leaveRequestsCollectionRef = collection(db, COLLECTIONS.HR.LEAVE_REQUESTS);
    const q = query(leaveRequestsCollectionRef, where("employeeId", "==", employeeId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeaveRequest));
  } catch (error) {
    console.error(`Error fetching leave requests for employee ${employeeId}:`, error);
    throw error;
  }
};

// Get a specific leave request
export const getLeaveRequest = async (id: string): Promise<LeaveRequest | null> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVE_REQUESTS, id);
    const docSnap = await getDoc(leaveRequestRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as LeaveRequest;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching leave request with ID ${id}:`, error);
    throw error;
  }
};

// Calculate duration in days between two dates
export const calculateDuration = (startDate: string, endDate: string): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because it's inclusive
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 1;
  }
};

// Create a new leave request
export const createLeaveRequest = async (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeaveRequest> => {
  try {
    // Calculate duration
    const durationDays = calculateDuration(data.startDate, data.endDate);
    
    // Prepare data for Firestore
    const leaveRequestData = {
      ...data,
      durationDays,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.LEAVE_REQUESTS), leaveRequestData);
    
    // Return the created document with ID
    return {
      id: docRef.id,
      ...leaveRequestData
    };
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw error;
  }
};

// Update a leave request
export const updateLeaveRequest = async (id: string, data: Partial<LeaveRequest>): Promise<void> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVE_REQUESTS, id);
    
    // If dates are updated, recalculate duration
    let updateData = { ...data, updatedAt: new Date().toISOString() };
    if (data.startDate && data.endDate) {
      updateData.durationDays = calculateDuration(data.startDate, data.endDate);
    }
    
    await updateDoc(leaveRequestRef, updateData);
  } catch (error) {
    console.error(`Error updating leave request with ID ${id}:`, error);
    throw error;
  }
};

// Delete a leave request
export const deleteLeaveRequest = async (id: string): Promise<void> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVE_REQUESTS, id);
    await deleteDoc(leaveRequestRef);
  } catch (error) {
    console.error(`Error deleting leave request with ID ${id}:`, error);
    throw error;
  }
};
