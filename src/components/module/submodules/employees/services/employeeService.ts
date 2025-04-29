
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const EMPLOYEES_COLLECTION = COLLECTIONS.HR.EMPLOYEES || 'employees';

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  try {
    const id = data.id || `emp-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const employeeData = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    await setDoc(docRef, employeeData);
    
    console.log('Employee created with ID:', id);
    return employeeData as Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Employee;
    }
    return null;
  } catch (error) {
    console.error('Error getting employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<void> => {
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    
    // Add updatedAt timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    console.log('Employee updated:', id);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const updateEmployeeDoc = async (id: string, data: Partial<Employee>): Promise<Employee | null> => {
  try {
    // First get the current document
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Employee with ID ${id} not found`);
    }
    
    const currentData = docSnap.data() as Employee;
    
    // Merge the data, being careful with nested objects
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Handle address properly
    if (data.address && typeof data.address === 'object') {
      updateData.address = {
        ...(typeof currentData.address === 'object' ? currentData.address : {}),
        ...data.address
      };
    }
    
    // Handle work address properly
    if (data.workAddress && typeof data.workAddress === 'object') {
      updateData.workAddress = {
        ...(typeof currentData.workAddress === 'object' ? currentData.workAddress : {}),
        ...data.workAddress
      };
    }
    
    await updateDoc(docRef, updateData);
    console.log('Employee updated with merged data:', id);
    
    // Get the updated document
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.exists() ? { id: updatedSnap.id, ...updatedSnap.data() } as Employee : null;
  } catch (error) {
    console.error('Error updating employee document:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    console.log('Deleting employee with ID:', id);
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Employee deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const syncManagerStatus = async (employee: Employee): Promise<void> => {
  try {
    if (employee.isManager) {
      console.log(`${employee.firstName} ${employee.lastName} is a manager. Adding to managers list...`);
      
      // Additional logic to update manager-specific collections could go here
      // For example, you might want to update a managers collection
    } else {
      console.log(`${employee.firstName} ${employee.lastName} is not a manager.`);
      
      // Check if they were previously a manager and update any references
    }
  } catch (error) {
    console.error('Error syncing manager status:', error);
    toast.error("Erreur lors de la mise à jour du statut de manager");
  }
};

export const checkForDuplicateEmail = async (email: string, excludeId?: string): Promise<boolean> => {
  try {
    const q = query(collection(db, EMPLOYEES_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false;
    }
    
    // Check if the only document with this email is the one we're updating
    if (excludeId) {
      return querySnapshot.docs.some(doc => doc.id !== excludeId);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking for duplicate email:', error);
    return false;
  }
};
