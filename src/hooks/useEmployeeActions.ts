
import { useState } from 'react';
import { toast } from 'sonner';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useEmployeeActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new employee
  const createEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a safe copy of the data to avoid undefined properties
      const safeEmployeeData = {
        ...employeeData,
        // Ensure skills is an array
        skills: Array.isArray(employeeData.skills) ? employeeData.skills : [],
        // Handle address properly
        address: typeof employeeData.address === 'string' 
          ? employeeData.address 
          : employeeData.address || { 
              street: '', 
              city: '', 
              postalCode: '', 
              country: '' 
            },
        // Ensure workAddress exists
        workAddress: employeeData.workAddress || { 
          street: '', 
          city: '', 
          postalCode: '', 
          country: '' 
        }
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.HR.EMPLOYEES), safeEmployeeData);
      console.log("Employee created with ID:", docRef.id);
      
      toast.success("Employé créé avec succès");
      return docRef.id;
    } catch (err) {
      const error = err as Error;
      console.error("Error creating employee:", error);
      setError(error);
      toast.error("Erreur lors de la création de l'employé");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing employee
  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      await updateDoc(employeeRef, employeeData);
      toast.success("Employé mis à jour avec succès");
      return true;
    } catch (err) {
      const error = err as Error;
      console.error("Error updating employee:", error);
      setError(error);
      toast.error("Erreur lors de la mise à jour de l'employé");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an employee
  const deleteEmployee = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
      toast.success("Employé supprimé avec succès");
      return true;
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting employee:", error);
      setError(error);
      toast.error("Erreur lors de la suppression de l'employé");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isLoading,
    error
  };
};
