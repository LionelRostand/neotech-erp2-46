import { db } from '@/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, DocumentReference } from 'firebase/firestore';
import { Employee, EmployeeFormValues } from '@/types/employee';

// Function to fetch an employee by ID
export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docSnap.id, ...docData } as Employee;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
};

// Function to update an employee
export const updateEmployee = async (id: string, data: Partial<EmployeeFormValues>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await updateDoc(docRef, data);
    console.log("Employee updated successfully!");
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Function to fetch all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const querySnapshot = await getDocs(collectionRef);
    const employees: Employee[] = [];

    querySnapshot.forEach(doc => {
      employees.push({
        id: doc.id,
        ...doc.data()
      } as Employee);
    });

    return employees;
  } catch (error) {
    console.error("Error fetching all employees:", error);
    return [];
  }
};

// Function to create a new employee
export const createEmployee = async (data: EmployeeFormValues): Promise<Employee | null> => {
  try {
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const docRef = await addDoc(collectionRef, data);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docRef.id, ...docData } as unknown as Employee;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    return null;
  }
};

// Function to delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await deleteDoc(docRef);
    console.log("Employee deleted successfully!");
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
