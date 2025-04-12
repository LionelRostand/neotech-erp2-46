
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
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
 * Vérifier si un employé avec des informations similaires existe déjà
 * @param employeeData Données de l'employé à vérifier
 * @param excludeId ID à exclure de la vérification (pour l'édition)
 * @returns Booléen indiquant si un doublon existe
 */
export const checkEmployeeDuplicate = async (
  employeeData: Partial<Employee>, 
  excludeId?: string
): Promise<boolean> => {
  try {
    let isDuplicate = false;
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    
    // Vérifier l'email personnel
    if (employeeData.email) {
      const emailQuery = query(employeesRef, where('email', '==', employeeData.email));
      const emailSnapshot = await getDocs(emailQuery);
      
      for (const doc of emailSnapshot.docs) {
        if (doc.id !== excludeId) {
          console.warn(`Un employé avec le même email personnel existe déjà: ${doc.id}`);
          isDuplicate = true;
          break;
        }
      }
    }
    
    // Vérifier l'email professionnel
    if (!isDuplicate && employeeData.professionalEmail) {
      const profEmailQuery = query(
        employeesRef, 
        where('professionalEmail', '==', employeeData.professionalEmail)
      );
      const profEmailSnapshot = await getDocs(profEmailQuery);
      
      for (const doc of profEmailSnapshot.docs) {
        if (doc.id !== excludeId) {
          console.warn(`Un employé avec le même email professionnel existe déjà: ${doc.id}`);
          isDuplicate = true;
          break;
        }
      }
    }
    
    // Vérifier la combinaison nom/prénom (optionnel, car peut être homonyme)
    if (!isDuplicate && employeeData.firstName && employeeData.lastName) {
      const nameQuery = query(
        employeesRef,
        where('firstName', '==', employeeData.firstName),
        where('lastName', '==', employeeData.lastName)
      );
      
      const nameSnapshot = await getDocs(nameQuery);
      
      for (const doc of nameSnapshot.docs) {
        if (doc.id !== excludeId) {
          console.warn(`Un employé avec les mêmes nom et prénom existe déjà: ${doc.id}`);
          // Ici nous pourrions mettre isDuplicate = true, mais c'est un cas où les homonymes sont possibles
          // On génère plutôt un avertissement
          toast.warning(`Un employé avec le nom ${employeeData.firstName} ${employeeData.lastName} existe déjà. Vérifiez qu'il ne s'agit pas d'un doublon.`);
          break;
        }
      }
    }
    
    return isDuplicate;
  } catch (error) {
    console.error('Erreur lors de la vérification des doublons:', error);
    return false; // En cas d'erreur, on laisse passer (mais idéalement, on devrait gérer mieux)
  }
};

/**
 * Add a new employee
 */
export const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<string | null> => {
  try {
    // Vérifier les doublons avant d'ajouter
    const isDuplicate = await checkEmployeeDuplicate(employeeData);
    
    if (isDuplicate) {
      toast.error('Un employé avec des informations similaires existe déjà');
      return null;
    }
    
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
    // Vérifier les doublons avant de mettre à jour, en excluant l'ID actuel
    const isDuplicate = await checkEmployeeDuplicate(data, id);
    
    if (isDuplicate) {
      toast.error('Un employé avec des informations similaires existe déjà');
      return false;
    }
    
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
