
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp, DocumentReference } from 'firebase/firestore';
import { PaySlipData } from '../types/payslip-types';

// Functions for managing payslips

// Create a new payslip
export const createPaySlip = async (payslipData: Omit<PaySlipData, 'id'>): Promise<PaySlipData> => {
  try {
    // Ensure all required fields are present and have default values if undefined
    const sanitizedData = {
      ...payslipData,
      // Make sure we have valid values for all fields
      employeeId: payslipData.employeeId || '',
      employeeName: payslipData.employeeName || 'Non spécifié',
      period: payslipData.period || new Date().toISOString(),
      grossSalary: payslipData.grossSalary || 0,
      netSalary: payslipData.netSalary || 0,
      taxes: payslipData.taxes || 0,
      contributions: payslipData.contributions || 0,
      // Make sure employee object exists and has all required fields with default values
      employee: {
        ...(payslipData.employee || {}),
        firstName: payslipData.employee?.firstName || '',
        lastName: payslipData.employee?.lastName || '',
        employeeId: payslipData.employee?.employeeId || payslipData.employeeId || '',
        role: payslipData.employee?.role || 'Employé', // Default role to prevent undefined
        socialSecurityNumber: payslipData.employee?.socialSecurityNumber || '',
        startDate: payslipData.employee?.startDate || '',
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Ensure we use a valid collection path
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const docRef = await addDoc(payslipsRef, sanitizedData);

    // Get the document to return complete data
    const docSnap = await getDoc(docRef);
    const docId = docRef.id;

    if (!docSnap.exists()) {
      throw new Error("Document does not exist after creation");
    }

    // Return the document data with the ID
    return { id: docId, ...docSnap.data() } as unknown as PaySlipData;
  } catch (error) {
    console.error("Error creating payslip:", error);
    throw error;
  }
};

// Function to fetch all payslips for an employee
export const getEmployeePaySlips = async (employeeId: string): Promise<PaySlipData[]> => {
  try {
    // Ensure we use a valid collection path
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const q = query(
      payslipsRef,
      where("employeeId", "==", employeeId),
      orderBy("period", "desc")
    );

    const querySnapshot = await getDocs(q);
    const payslips: PaySlipData[] = [];

    querySnapshot.forEach((doc) => {
      payslips.push({
        id: doc.id,
        ...doc.data()
      } as PaySlipData);
    });

    return payslips;
  } catch (error) {
    console.error("Error fetching employee payslips:", error);
    return [];
  }
};

// Function to update an existing payslip
export const updatePaySlip = async (payslipId: string, data: Partial<PaySlipData>): Promise<PaySlipData> => {
  try {
    // Ensure we use a valid collection path
    const payslipRef = doc(db, COLLECTIONS.HR.PAYSLIPS, payslipId);
    
    await updateDoc(payslipRef, {
      ...data,
      updatedAt: Timestamp.now()
    });

    // Return the updated document
    const updatedDoc = await getDoc(payslipRef);
    
    if (!updatedDoc.exists()) {
      throw new Error("Document does not exist after update");
    }
    
    return { id: payslipId, ...updatedDoc.data() } as unknown as PaySlipData;
  } catch (error) {
    console.error("Error updating payslip:", error);
    throw error;
  }
};

// Function to save a new payslip (alias for createPaySlip for backward compatibility)
export const savePaySlip = createPaySlip;
