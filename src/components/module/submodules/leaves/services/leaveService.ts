
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Define the structure of a leave request
interface LeaveRequest {
  id?: string;
  employeeId: string;
  type: 'paid' | 'unpaid' | 'sick' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all leave requests
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  try {
    const leaveRequestsRef = collection(db, COLLECTIONS.HR.LEAVES);
    const snapshot = await getDocs(leaveRequestsRef);
    
    return snapshot.docs.map(doc => ({
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
    const leaveRequestsRef = collection(db, COLLECTIONS.HR.LEAVES);
    const q = query(leaveRequestsRef, where("employeeId", "==", employeeId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeaveRequest));
  } catch (error) {
    console.error(`Error fetching leave requests for employee ${employeeId}:`, error);
    throw error;
  }
};

// Create a new leave request
export const createLeaveRequest = async (leaveData: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> => {
  try {
    const leaveRequestsRef = collection(db, COLLECTIONS.HR.LEAVES);
    const docRef = await addDoc(leaveRequestsRef, leaveData);
    
    return {
      id: docRef.id,
      ...leaveData
    };
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw error;
  }
};

// Update an existing leave request
export const updateLeaveRequest = async (id: string, leaveData: Partial<LeaveRequest>): Promise<void> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVES, id);
    await updateDoc(leaveRequestRef, {
      ...leaveData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating leave request ${id}:`, error);
    throw error;
  }
};

// Update the status of a leave request
export const updateLeaveRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'canceled', approverId?: string): Promise<void> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVES, id);
    
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    // If status is approved and approverId is provided, add approver info
    if (status === 'approved' && approverId) {
      updateData.approvedBy = approverId;
      updateData.approvedAt = new Date().toISOString();
    }
    
    await updateDoc(leaveRequestRef, updateData);
  } catch (error) {
    console.error(`Error updating leave request status ${id}:`, error);
    throw error;
  }
};

// Delete a leave request
export const deleteLeaveRequest = async (id: string): Promise<void> => {
  try {
    const leaveRequestRef = doc(db, COLLECTIONS.HR.LEAVES, id);
    await deleteDoc(leaveRequestRef);
  } catch (error) {
    console.error(`Error deleting leave request ${id}:`, error);
    throw error;
  }
};
