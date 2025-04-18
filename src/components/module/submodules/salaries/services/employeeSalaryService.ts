
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Add a payslip to an employee's record
 * @param employeeId The ID of the employee
 * @param payslipId The ID of the payslip to add
 * @returns A promise that resolves with true if successful, false otherwise
 */
export const addPayslipToEmployee = async (employeeId: string, payslipId: string): Promise<boolean> => {
  try {
    if (!employeeId || !payslipId) {
      console.error("Missing employeeId or payslipId", { employeeId, payslipId });
      return false;
    }
    
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    // Vérifier que nous avons des valeurs définies avant d'utiliser arrayUnion
    // car Firebase n'accepte pas les valeurs undefined dans arrayUnion
    if (payslipId) {
      await updateDoc(employeeRef, {
        payslips: arrayUnion(payslipId)
      });
      return true;
    } else {
      console.error("Cannot add undefined payslipId to employee record");
      return false;
    }
  } catch (error) {
    console.error("Error adding payslip to employee:", error);
    return false;
  }
};
