
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { PaySlip } from '@/types/payslip';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';
import { addEmployeeDocument } from '../../employees/services/documentService';
import { toast } from 'sonner';

// Save a payslip to the Firestore database
export const savePaySlip = async (payslip: PaySlip): Promise<PaySlip> => {
  try {
    // Create a reference to the payslips collection
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    
    // Add document with timestamp
    const docRef = await addDoc(payslipsRef, {
      ...payslip,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Return the document with its new ID
    return {
      ...payslip,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving payslip:', error);
    throw new Error('Failed to save payslip');
  }
};

// Save payslip PDF to employee documents
export const savePaySlipToEmployeeDocuments = async (payslip: PaySlip): Promise<boolean> => {
  try {
    if (!payslip.employeeId) {
      throw new Error('No employee ID associated with payslip');
    }
    
    // Generate PDF
    const doc = generatePayslipPdf(payslip);
    
    // Get PDF as base64 data
    const pdfBase64 = doc.output('datauristring');
    
    // Create document metadata
    const documentData = {
      type: 'Fiche de paie',
      name: `Bulletin de paie - ${payslip.period}`,
      title: `Bulletin de paie - ${payslip.period}`,
      fileType: 'application/pdf',
      fileData: pdfBase64,
      date: new Date().toISOString(),
      employeeId: payslip.employeeId,
      documentId: `payslip_${payslip.id}`,
      url: pdfBase64
    };
    
    // Add document to employee profile
    await addEmployeeDocument(payslip.employeeId, documentData);
    
    return true;
  } catch (error) {
    console.error('Error saving payslip to employee documents:', error);
    toast.error("Erreur lors de l'enregistrement du document");
    return false;
  }
};

// Get all payslips
export const getAllPayslips = async (): Promise<PaySlip[]> => {
  try {
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const q = query(payslipsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PaySlip));
  } catch (error) {
    console.error('Error fetching payslips:', error);
    return [];
  }
};

// Get payslips for a specific employee
export const getEmployeePayslips = async (employeeId: string): Promise<PaySlip[]> => {
  try {
    const payslipsRef = collection(db, COLLECTIONS.HR.PAYSLIPS);
    const q = query(
      payslipsRef, 
      where('employeeId', '==', employeeId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PaySlip));
  } catch (error) {
    console.error('Error fetching employee payslips:', error);
    return [];
  }
};
