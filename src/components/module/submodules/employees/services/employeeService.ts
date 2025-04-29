
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, DocumentReference } from 'firebase/firestore';
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
    console.log("Updating employee with data:", data);
    
    // Clean up any undefined or null values to prevent Firebase errors
    const cleanedData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanedData[key] = value;
      }
    });
    
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await updateDoc(docRef, cleanedData);
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
    console.log("Creating employee with data:", data);
    
    // Clean up any undefined or null values to prevent Firebase errors
    const cleanedData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanedData[key] = value;
      }
    });
    
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const docRef = await addDoc(collectionRef, cleanedData);
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

// Function to update employee skills
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

// Function to synchronize manager status
export const syncManagerStatus = async (employeeData: Employee): Promise<boolean> => {
  try {
    if (employeeData.isManager) {
      console.log(`Syncing manager status for ${employeeData.firstName} ${employeeData.lastName}`);
      // Additional logic for manager synchronization can be added here
    }
    return true;
  } catch (error) {
    console.error("Error syncing manager status:", error);
    return false;
  }
};

// Function to update employee document with improved error handling
export const updateEmployeeDoc = async (id: string, data: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log("Updating employee document:", id, data);
    
    // Clean up any undefined or null values to prevent Firebase errors
    const cleanedData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle nested objects like address and workAddress separately
        if (key === 'address' || key === 'workAddress') {
          if (typeof value === 'object' && !Array.isArray(value)) {
            const nestedObj: Record<string, any> = {};
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined && nestedValue !== null) {
                nestedObj[nestedKey] = nestedValue;
              }
            });
            if (Object.keys(nestedObj).length > 0) {
              cleanedData[key] = nestedObj;
            }
          }
        } else {
          cleanedData[key] = value;
        }
      }
    });
    
    // Set updatedAt timestamp
    cleanedData.updatedAt = new Date().toISOString();
    
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    await updateDoc(docRef, cleanedData);
    
    // Return the updated document
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id, ...updatedDoc.data() } as Employee;
    }
    return null;
  } catch (error) {
    console.error("Error updating employee document:", error);
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
