
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { Employee } from '@/types/employee';

// Define the EmployeeFormValues type if it doesn't exist
export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  [key: string]: any;
}

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
      return { id: docRef.id, ...docData } as Employee;
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

// Add a function to update employee skills
export const updateEmployeeSkills = async (employeeId: string, skills: any[]): Promise<boolean> => {
  try {
    await updateEmployee(employeeId, { skills });
    console.log("Employee skills updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating employee skills:", error);
    throw error;
  }
};

// Add the missing refreshEmployeesData function
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    return await getAllEmployees();
  } catch (error) {
    console.error("Error refreshing employees data:", error);
    return [];
  }
};
