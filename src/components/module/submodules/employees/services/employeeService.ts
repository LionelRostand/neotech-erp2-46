
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { generateUniqueEmployeeId, prepareEmployeeData } from '../form/employeeUtils';

// Function to get all employees (including managers)
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Get regular employees
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesQuery = query(employeesRef, orderBy('lastName', 'asc'));
    const employeesSnapshot = await getDocs(employeesQuery);
    
    // Get managers 
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersQuery = query(managersRef, orderBy('lastName', 'asc'));
    const managersSnapshot = await getDocs(managersQuery);
    
    // Combine and process both collections
    const regularEmployees = employeesSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      isManager: false
    })) as Employee[];
    
    const managers = managersSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id, 
      isManager: true
    })) as Employee[];
    
    // Return combined list
    return [...regularEmployees, ...managers];
  } catch (error) {
    console.error("Error fetching employees:", error);
    toast.error("Erreur lors du chargement des employés");
    return [];
  }
};

// Function to get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Try to get from employees collection first
    const employeeDoc = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const employeeSnap = await getDoc(employeeDoc);
    
    if (employeeSnap.exists()) {
      return {
        ...employeeSnap.data(),
        id: employeeSnap.id,
        isManager: false
      } as Employee;
    }
    
    // If not found, try managers collection
    const managerDoc = doc(db, COLLECTIONS.HR.MANAGERS, id);
    const managerSnap = await getDoc(managerDoc);
    
    if (managerSnap.exists()) {
      return {
        ...managerSnap.data(),
        id: managerSnap.id,
        isManager: true
      } as Employee;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching employee:", error);
    toast.error("Erreur lors du chargement des données de l'employé");
    return null;
  }
};

// Function to create a new employee
export const createEmployee = async (employeeData: EmployeeFormValues): Promise<Employee | null> => {
  try {
    const newEmployeeId = generateUniqueEmployeeId();
    const preparedData = prepareEmployeeData(employeeData, newEmployeeId);
    
    // Determine which collection to use based on manager status
    const collectionPath = preparedData.isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    const employeeRef = collection(db, collectionPath);
    const docRef = await addDoc(employeeRef, {
      ...preparedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Get the created employee to return
    const employeeSnap = await getDoc(docRef);
    
    if (employeeSnap.exists()) {
      const newEmployee = {
        ...employeeSnap.data(),
        id: employeeSnap.id,
        isManager: !!preparedData.isManager
      } as Employee;
      
      toast.success(`Employé ${preparedData.firstName} ${preparedData.lastName} créé avec succès`);
      return newEmployee;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating employee:", error);
    toast.error("Erreur lors de la création de l'employé");
    return null;
  }
};

// Function to update an existing employee
export const updateEmployee = async (
  id: string, 
  employeeData: Partial<Employee>
): Promise<Employee | null> => {
  try {
    // Determine which collection to use based on current isManager status
    const existingEmployee = await getEmployeeById(id);
    
    if (!existingEmployee) {
      toast.error("Employé non trouvé");
      return null;
    }
    
    const collectionPath = existingEmployee.isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    const employeeRef = doc(db, collectionPath, id);
    
    // Prepare update data
    const updateData = {
      ...employeeData,
      updatedAt: Timestamp.now()
    };
    
    // Remove id and isManager from update data to prevent overwrites
    delete updateData.id;

    // Use type assertion to handle the isManager property correctly
    await updateDoc(employeeRef, updateData);
    
    // Check if manager status changed, if so, move to the appropriate collection
    const shouldBeManager = employeeData.role?.toLowerCase().includes('manager') || 
                           employeeData.position?.toLowerCase().includes('manager') ||
                           employeeData.position?.toLowerCase().includes('directeur');
    
    if (shouldBeManager !== undefined && shouldBeManager !== existingEmployee.isManager) {
      // Need to move the employee to the other collection
      const newCollectionPath = shouldBeManager 
        ? COLLECTIONS.HR.MANAGERS 
        : COLLECTIONS.HR.EMPLOYEES;
      
      // Add to new collection
      const newRef = collection(db, newCollectionPath);
      await addDoc(newRef, {
        ...existingEmployee,
        ...updateData,
        isManager: shouldBeManager
      });
      
      // Delete from old collection
      await deleteDoc(employeeRef);
      
      toast.success(`L'employé a été déplacé vers la collection ${shouldBeManager ? 'managers' : 'employees'}`);
    }
    
    // Get the updated employee
    const updatedEmployee = await getEmployeeById(id);
    
    if (updatedEmployee) {
      toast.success(`Employé ${updatedEmployee.firstName} ${updatedEmployee.lastName} mis à jour avec succès`);
      return updatedEmployee;
    }
    
    return null;
  } catch (error) {
    console.error("Error updating employee:", error);
    toast.error("Erreur lors de la mise à jour de l'employé");
    return null;
  }
};

// Function to delete an employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    // Check which collection the employee is in
    const employeeDoc = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const employeeSnap = await getDoc(employeeDoc);
    
    if (employeeSnap.exists()) {
      await deleteDoc(employeeDoc);
      toast.success("Employé supprimé avec succès");
      return true;
    }
    
    const managerDoc = doc(db, COLLECTIONS.HR.MANAGERS, id);
    const managerSnap = await getDoc(managerDoc);
    
    if (managerSnap.exists()) {
      await deleteDoc(managerDoc);
      toast.success("Manager supprimé avec succès");
      return true;
    }
    
    toast.error("Employé non trouvé");
    return false;
  } catch (error) {
    console.error("Error deleting employee:", error);
    toast.error("Erreur lors de la suppression de l'employé");
    return false;
  }
};

// Function to update employee skills
export const updateEmployeeSkills = async (
  employeeId: string, 
  skills: string[]
): Promise<boolean> => {
  try {
    const employee = await getEmployeeById(employeeId);
    
    if (!employee) {
      toast.error("Employé non trouvé");
      return false;
    }
    
    const collectionPath = employee.isManager
      ? COLLECTIONS.HR.MANAGERS
      : COLLECTIONS.HR.EMPLOYEES;
      
    const employeeRef = doc(db, collectionPath, employeeId);
    
    await updateDoc(employeeRef, {
      skills,
      updatedAt: Timestamp.now()
    });
    
    toast.success("Compétences mises à jour avec succès");
    return true;
  } catch (error) {
    console.error("Error updating employee skills:", error);
    toast.error("Erreur lors de la mise à jour des compétences");
    return false;
  }
};

// Function to refresh employees data (for UI updates)
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    const employees = await getAllEmployees();
    return employees;
  } catch (error) {
    console.error("Error refreshing employees data:", error);
    toast.error("Erreur lors du rafraîchissement des données");
    return [];
  }
};
