import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

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

// Function to fetch department name by ID
export const getDepartmentName = async (departmentId: string): Promise<string> => {
  try {
    if (!departmentId || departmentId === 'no_department') {
      return 'Non spécifié';
    }
    
    const docRef = doc(db, COLLECTIONS.HR.DEPARTMENTS, departmentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().name || 'Non spécifié';
    } else {
      console.log("No department with this ID:", departmentId);
      return 'Non spécifié';
    }
  } catch (error) {
    console.error("Error fetching department:", error);
    return 'Non spécifié';
  }
};

// Function to fetch an employee by ID
export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    if (!id) {
      console.warn("No employee ID provided");
      return null;
    }
    
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      
      // Get department name if department ID exists
      let departmentName = 'Non spécifié';
      if (docData.department || docData.departmentId) {
        const deptId = docData.departmentId || docData.department;
        if (typeof deptId === 'string' && deptId !== 'no_department') {
          departmentName = await getDepartmentName(deptId);
        }
      }
      
      return { 
        id: docSnap.id, 
        ...docData,
        // Keep the department ID in departmentId and use the name for display
        departmentId: docData.departmentId || docData.department,
        department: departmentName
      } as Employee;
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
export const updateEmployee = async (id: string, data: Partial<EmployeeFormValues>): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error("Employee ID is required for update");
    }
    
    console.log("Updating employee:", id, data);
    
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error("Employee document does not exist");
      return false;
    }
    
    // Make sure department is saved as departmentId if it represents an ID
    const updateData = {
      ...data,
      departmentId: data.department, // Store both for compatibility
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    console.log("Employee updated successfully!");
    toast.success("Employé mis à jour avec succès");
    return true;
  } catch (error) {
    console.error("Error updating employee:", error);
    toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return false;
  }
};

// Function to fetch all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const querySnapshot = await getDocs(collectionRef);
    const employees: Employee[] = [];
    const deptCache = new Map<string, string>(); // Cache for department names

    for (const doc of querySnapshot.docs) {
      if (doc.exists()) {
        const data = doc.data();
        
        // Use the department cache or fetch the department name
        let departmentName = 'Non spécifié';
        const deptId = data.departmentId || data.department;
        
        if (typeof deptId === 'string' && deptId !== 'no_department') {
          if (deptCache.has(deptId)) {
            departmentName = deptCache.get(deptId) || 'Non spécifié';
          } else {
            departmentName = await getDepartmentName(deptId);
            deptCache.set(deptId, departmentName);
          }
        }
        
        employees.push({
          id: doc.id,
          ...data,
          departmentId: deptId,
          department: departmentName
        } as Employee);
      }
    }

    return employees;
  } catch (error) {
    console.error("Error fetching all employees:", error);
    return [];
  }
};

// Function to create a new employee
export const createEmployee = async (data: EmployeeFormValues): Promise<Employee | null> => {
  try {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error("First name, last name, and email are required");
    }
    
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    
    // Store department as departmentId for consistency
    const employeeData = {
      ...data,
      departmentId: data.department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collectionRef, employeeData);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      
      // Get department name
      let departmentName = 'Non spécifié';
      const deptId = docData.departmentId || docData.department;
      if (typeof deptId === 'string' && deptId !== 'no_department') {
        departmentName = await getDepartmentName(deptId);
      }
      
      return { 
        id: docRef.id, 
        ...docData,
        departmentId: deptId,
        department: departmentName
      } as unknown as Employee;
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
    if (!id) {
      throw new Error("Employee ID is required for deletion");
    }
    
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
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    // Ensure skills is an array
    const safeSkills = Array.isArray(skills) ? skills : [];
    
    const success = await updateEmployee(employeeId, { skills: safeSkills });
    console.log("Employee skills updated successfully!");
    return success;
  } catch (error) {
    console.error("Error updating employee skills:", error);
    throw error;
  }
};

// Function to fetch employees by department ID
export const getEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    if (!departmentId) {
      return [];
    }
    
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const q = query(employeesRef, 
      where('departmentId', '==', departmentId)
    );
    
    const querySnapshot = await getDocs(q);
    const employees: Employee[] = [];
    
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        employees.push({
          id: doc.id,
          ...doc.data(),
          departmentId: departmentId,
          department: 'Chargement...' // Will be updated by the component
        } as Employee);
      }
    });
    
    return employees;
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    return [];
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
