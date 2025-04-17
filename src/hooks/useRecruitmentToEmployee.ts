
import { useState } from 'react';
import { doc, setDoc, updateDoc, Timestamp, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook to convert a candidate/recruitment post to an employee
 */
export const useRecruitmentToEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Convert a candidate to an employee
   * @param candidateData The candidate data
   * @param postData The recruitment post data
   * @returns The new employee ID or null if failed
   */
  const convertToEmployee = async (candidateData: any, postData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Make sure we have valid collection paths
      if (!COLLECTIONS.HR.EMPLOYEES || !COLLECTIONS.HR.RECRUITMENT) {
        throw new Error('Invalid collection path configuration');
      }

      // Create the employee record
      const employeeId = uuidv4();
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);

      // Create new employee record
      const newEmployeeData = {
        id: employeeId,
        firstName: candidateData.firstName || '',
        lastName: candidateData.lastName || '',
        email: candidateData.email || '',
        phone: candidateData.phone || '',
        position: postData.position || 'New Employee',
        department: postData.department || '',
        status: 'active',
        hireDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Add other relevant fields from the candidate's data
        address: candidateData.address || {},
        birthDate: candidateData.birthDate || null,
        cv: candidateData.cvUrl || '',
        recruitmentSource: 'internal',
        recruitmentPostId: postData.id || ''
      };

      // Add the employee to Firestore
      await setDoc(employeeRef, newEmployeeData);

      // Update the recruitment post to mark this candidate as hired
      if (postData.id) {
        const postRef = doc(db, COLLECTIONS.HR.RECRUITMENT, postData.id);
        await updateDoc(postRef, {
          status: 'Fermée',
          hiredCandidateId: candidateData.id,
          hiredEmployeeId: employeeId,
          updatedAt: Timestamp.now()
        });
      }

      toast.success(`${candidateData.firstName} ${candidateData.lastName} a été embauché(e) avec succès`);
      return employeeId;
    } catch (err) {
      console.error('Error converting candidate to employee:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      toast.error(`Erreur lors de l'embauche: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Alias for better API naming
  const convertCandidateToEmployee = convertToEmployee;

  return { convertToEmployee, convertCandidateToEmployee, loading, isConverting, error };
};

export default useRecruitmentToEmployee;
