
import { Employee } from '@/types/employee';
import { collection, doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EMPLOYEES_COLLECTION = COLLECTIONS.HR.EMPLOYEES;

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    console.log('Fetching all employees from collection:', EMPLOYEES_COLLECTION);
    const querySnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
    
    const employees = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Employee[];
    
    console.log(`Retrieved ${employees.length} employees`);
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Return empty array instead of throwing error to prevent UI crashes
    return [];
  }
};

// Get a single employee by ID
export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    if (!id) {
      console.error('Invalid employee ID provided');
      return null;
    }
    
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const employeeData = { 
        id: docSnap.id, 
        ...docSnap.data() 
      } as Employee;
      
      return employeeData;
    }
    
    console.log(`No employee found with ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

// Update an employee
export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Employee ID is required for update');
    }
    
    console.log(`Updating employee ${id} with data:`, data);
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, id);
    
    // Handle skills field specially - ensure it's properly formatted
    if (data.skills) {
      console.log('Processing skills before update:', data.skills);
      
      // Make sure skills is an array
      const skillsArray = Array.isArray(data.skills) ? data.skills : [];
      
      // Process each skill to ensure it has the right format
      data.skills = skillsArray
        .filter(skill => skill !== null && skill !== undefined)
        .map(skill => {
          if (typeof skill === 'string') {
            return {
              id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: skill,
              level: 'débutant'
            };
          }
          // If it's already an object, ensure it has all required fields
          const skillObj = skill as any;
          return {
            id: skillObj.id || `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: skillObj.name || 'Compétence',
            level: skillObj.level || 'débutant'
          };
        });
      
      console.log('Skills after processing:', data.skills);
    }
    
    await updateDoc(employeeRef, data);
    console.log(`Employee ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (data: Omit<Employee, 'id'>): Promise<Employee> => {
  try {
    // Process skills if provided
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills
        .filter(skill => skill !== null && skill !== undefined)
        .map(skill => {
          if (typeof skill === 'string') {
            return {
              id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: skill,
              level: 'débutant'
            };
          }
          // If it's already an object, ensure it has all required fields
          const skillObj = skill as any;
          return {
            id: skillObj.id || `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: skillObj.name || 'Compétence',
            level: skillObj.level || 'débutant'
          };
        });
    }
    
    const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), data);
    return { id: docRef.id, ...data } as Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, id);
    await deleteDoc(employeeRef);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// Check if an employee is manager of any department
export const checkIfManager = async (employeeId: string): Promise<boolean> => {
  try {
    if (!employeeId) {
      return false;
    }
    
    const departmentsQuery = query(
      collection(db, COLLECTIONS.HR.DEPARTMENTS), 
      where('managerId', '==', employeeId)
    );
    
    const querySnapshot = await getDocs(departmentsQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if employee is manager:', error);
    return false;
  }
};
