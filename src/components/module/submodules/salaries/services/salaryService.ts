
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  monthName: string;
  grossSalary: number;
  netSalary: number;
  date: string;
  status: string;
  [key: string]: any;
}

// Add a new payslip
export const addPayslip = async (payslip: Payslip): Promise<Payslip> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const payslipRef = await addDoc(payslipsRef, payslip);
    
    // Get the newly created document
    const payslipDoc = await getDoc(payslipRef);
    
    if (payslipDoc.exists()) {
      return { id: payslipDoc.id, ...payslipDoc.data() } as Payslip;
    } else {
      throw new Error('Failed to retrieve created payslip');
    }
  } catch (error) {
    console.error('Error adding payslip:', error);
    throw error;
  }
};

// Get all payslips
export const getAllPayslips = async (): Promise<Payslip[]> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const q = query(payslipsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const payslips: Payslip[] = [];
    querySnapshot.forEach((doc) => {
      payslips.push({ id: doc.id, ...doc.data() } as Payslip);
    });
    
    return payslips;
  } catch (error) {
    console.error('Error getting payslips:', error);
    throw error;
  }
};

// Get payslips for a specific employee
export const getEmployeePayslips = async (employeeId: string): Promise<Payslip[]> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const q = query(
      payslipsRef,
      where('employeeId', '==', employeeId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const payslips: Payslip[] = [];
    querySnapshot.forEach((doc) => {
      payslips.push({ id: doc.id, ...doc.data() } as Payslip);
    });
    
    return payslips;
  } catch (error) {
    console.error('Error getting employee payslips:', error);
    throw error;
  }
};

// Get a single payslip by ID
export const getPayslip = async (payslipId: string): Promise<Payslip | null> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipRef = doc(db, COLLECTIONS.HR.PAYSLIPS, payslipId);
    const payslipDoc = await getDoc(payslipRef);
    
    if (payslipDoc.exists()) {
      return { id: payslipDoc.id, ...payslipDoc.data() } as Payslip;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting payslip:', error);
    throw error;
  }
};

// Update a payslip
export const updatePayslip = async (payslipId: string, data: Partial<Payslip>): Promise<void> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipRef = doc(db, COLLECTIONS.HR.PAYSLIPS, payslipId);
    await updateDoc(payslipRef, data);
  } catch (error) {
    console.error('Error updating payslip:', error);
    throw error;
  }
};

// Delete a payslip
export const deletePayslip = async (payslipId: string): Promise<void> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const payslipRef = doc(db, COLLECTIONS.HR.PAYSLIPS, payslipId);
    await deleteDoc(payslipRef);
  } catch (error) {
    console.error('Error deleting payslip:', error);
    throw error;
  }
};
