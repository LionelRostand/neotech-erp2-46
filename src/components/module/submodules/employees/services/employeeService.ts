
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

/**
 * Récupère tous les employés (managers et non-managers)
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    const employees = employeesSnapshot.docs.map(doc => ({ 
      ...doc.data(), 
      id: doc.id,
      isManager: false 
    }) as Employee);
    
    // Récupérer les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersSnapshot = await getDocs(managersRef);
    const managers = managersSnapshot.docs.map(doc => ({ 
      ...doc.data(), 
      id: doc.id,
      isManager: true 
    }) as Employee);
    
    // Combiner les deux ensembles
    return [...employees, ...managers].sort((a, b) => 
      (a.lastName || '').localeCompare(b.lastName || '')
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    toast.error('Impossible de récupérer les employés');
    return [];
  }
};

/**
 * Récupère un employé par son ID (vérifie les deux collections)
 */
export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    // Vérifier d'abord dans la collection employés
    const employeeDocRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeDocRef);
    
    if (employeeDoc.exists()) {
      return { ...employeeDoc.data(), id: employeeDoc.id, isManager: false } as Employee;
    }
    
    // Si non trouvé, vérifier dans la collection managers
    const managerDocRef = doc(db, COLLECTIONS.HR.MANAGERS, employeeId);
    const managerDoc = await getDoc(managerDocRef);
    
    if (managerDoc.exists()) {
      return { ...managerDoc.data(), id: managerDoc.id, isManager: true } as Employee;
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${employeeId} :`, error);
    return null;
  }
};

/**
 * Crée ou met à jour un employé (dans la collection appropriée selon isManager)
 */
export const saveEmployee = async (employee: Employee): Promise<boolean> => {
  try {
    const collectionPath = employee.isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    await setDoc(doc(db, collectionPath, employee.id), {
      ...employee,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'employé :', error);
    toast.error('Impossible de sauvegarder l\'employé');
    return false;
  }
};

/**
 * Supprime un employé (vérifie les deux collections)
 */
export const deleteEmployee = async (employeeId: string): Promise<boolean> => {
  try {
    // Vérifier d'abord si c'est un employé régulier
    const employeeDocRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeDocRef);
    
    if (employeeDoc.exists()) {
      await deleteDoc(employeeDocRef);
      return true;
    }
    
    // Sinon, vérifier si c'est un manager
    const managerDocRef = doc(db, COLLECTIONS.HR.MANAGERS, employeeId);
    const managerDoc = await getDoc(managerDocRef);
    
    if (managerDoc.exists()) {
      await deleteDoc(managerDocRef);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'employé ${employeeId} :`, error);
    toast.error('Impossible de supprimer l\'employé');
    return false;
  }
};

/**
 * Met à jour un employé et le déplace dans la collection appropriée si son statut de manager a changé
 */
export const updateEmployee = async (employee: Employee): Promise<boolean> => {
  try {
    // Récupérer l'employé actuel pour vérifier s'il était déjà un manager
    const existingEmployee = await getEmployeeById(employee.id);
    
    if (!existingEmployee) {
      toast.error('Employé non trouvé');
      return false;
    }
    
    // Si le statut de manager a changé, supprimer de l'ancienne collection et ajouter à la nouvelle
    if (existingEmployee.isManager !== employee.isManager) {
      // Supprimer de l'ancienne collection
      const oldCollectionPath = existingEmployee.isManager 
        ? COLLECTIONS.HR.MANAGERS 
        : COLLECTIONS.HR.EMPLOYEES;
      
      await deleteDoc(doc(db, oldCollectionPath, employee.id));
      
      // Ajouter à la nouvelle collection
      const newCollectionPath = employee.isManager 
        ? COLLECTIONS.HR.MANAGERS 
        : COLLECTIONS.HR.EMPLOYEES;
      
      await setDoc(doc(db, newCollectionPath, employee.id), {
        ...employee,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Si le statut n'a pas changé, mettre à jour dans la même collection
      const collectionPath = employee.isManager 
        ? COLLECTIONS.HR.MANAGERS 
        : COLLECTIONS.HR.EMPLOYEES;
      
      await updateDoc(doc(db, collectionPath, employee.id), {
        ...employee,
        updatedAt: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'employé ${employee.id} :`, error);
    toast.error('Impossible de mettre à jour l\'employé');
    return false;
  }
};

/**
 * Met à jour les compétences d'un employé
 */
export const updateEmployeeSkills = async (employeeId: string, skills: string[]): Promise<boolean> => {
  try {
    // Récupérer l'employé actuel
    const employee = await getEmployeeById(employeeId);
    
    if (!employee) {
      toast.error('Employé non trouvé');
      return false;
    }
    
    // Mettre à jour uniquement le champ skills
    const collectionPath = employee.isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    await updateDoc(doc(db, collectionPath, employeeId), {
      skills,
      updatedAt: new Date().toISOString()
    });
    
    toast.success('Compétences mises à jour avec succès');
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour des compétences de l'employé ${employeeId} :`, error);
    toast.error('Impossible de mettre à jour les compétences');
    return false;
  }
};

/**
 * Recherche des employés par nom ou email
 */
export const searchEmployees = async (searchTerm: string): Promise<Employee[]> => {
  try {
    const results: Employee[] = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    // Rechercher dans les employés
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    
    employeesSnapshot.forEach(doc => {
      const data = doc.data() as Employee;
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      const email = (data.email || '').toLowerCase();
      
      if (fullName.includes(searchTermLower) || email.includes(searchTermLower)) {
        results.push({ ...data, id: doc.id, isManager: false } as Employee);
      }
    });
    
    // Rechercher dans les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersSnapshot = await getDocs(managersRef);
    
    managersSnapshot.forEach(doc => {
      const data = doc.data() as Employee;
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      const email = (data.email || '').toLowerCase();
      
      if (fullName.includes(searchTermLower) || email.includes(searchTermLower)) {
        results.push({ ...data, id: doc.id, isManager: true } as Employee);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'employés :', error);
    return [];
  }
};

/**
 * Récupère les employés par département
 */
export const getEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    const results: Employee[] = [];
    
    // Rechercher dans les employés
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesQuery = query(employeesRef, where('departmentId', '==', departmentId));
    const employeesSnapshot = await getDocs(employeesQuery);
    
    employeesSnapshot.forEach(doc => {
      results.push({ ...doc.data(), id: doc.id, isManager: false } as Employee);
    });
    
    // Rechercher dans les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersQuery = query(managersRef, where('departmentId', '==', departmentId));
    const managersSnapshot = await getDocs(managersQuery);
    
    managersSnapshot.forEach(doc => {
      results.push({ ...doc.data(), id: doc.id, isManager: true } as Employee);
    });
    
    return results;
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés du département ${departmentId} :`, error);
    return [];
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
  saveEmployee,
  deleteEmployee,
  updateEmployee,
  updateEmployeeSkills,
  searchEmployees,
  getEmployeesByDepartment
};
