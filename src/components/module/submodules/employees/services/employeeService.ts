
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Fetch employees data from Firestore
 */
export const fetchEmployeesData = async (): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const q = query(employeesRef, orderBy('lastName', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Employee));
  } catch (error) {
    console.error('Error fetching employees:', error);
    toast.error('Error fetching employees data');
    return [];
  }
};

/**
 * Refresh employees data (same as fetchEmployeesData but named differently for clarity)
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  return fetchEmployeesData();
};

/**
 * Get an employee by ID
 */
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Employee;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting employee:', error);
    toast.error('Error retrieving employee data');
    return null;
  }
};

/**
 * Add a new employee
 */
export const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.EMPLOYEES), employeeData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding employee:', error);
    toast.error('Error adding new employee');
    return null;
  }
};

/**
 * Update an employee
 */
export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
    toast.error('Error updating employee data');
    return false;
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    toast.error('Error deleting employee');
    return false;
  }
};
