
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { generateUniqueEmployeeId } from '../form/employeeUtils';

/**
 * Récupérer tous les employés (incluant les managers)
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers
    const employeesSnapshot = await getDocs(
      query(collection(db, COLLECTIONS.HR.EMPLOYEES), orderBy('lastName', 'asc'))
    );
    
    // Récupérer les managers
    const managersSnapshot = await getDocs(
      query(collection(db, COLLECTIONS.HR.MANAGERS), orderBy('lastName', 'asc'))
    );
    
    // Combiner les deux ensembles
    const employees = employeesSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      isManager: false
    })) as Employee[];
    
    const managers = managersSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      isManager: true
    })) as Employee[];
    
    // Combiner et trier
    return [...employees, ...managers].sort((a, b) => 
      a.lastName?.localeCompare(b.lastName || '') || 0
    );
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Récupérer un employé par son ID
 */
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Vérifier d'abord dans la collection des employés
    const employeeDoc = await getDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
    
    if (employeeDoc.exists()) {
      return {
        ...employeeDoc.data(),
        id: employeeDoc.id,
        isManager: false
      } as Employee;
    }
    
    // Sinon, vérifier dans la collection des managers
    const managerDoc = await getDoc(doc(db, COLLECTIONS.HR.MANAGERS, id));
    
    if (managerDoc.exists()) {
      return {
        ...managerDoc.data(),
        id: managerDoc.id,
        isManager: true
      } as Employee;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

/**
 * Créer un nouvel employé
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
  try {
    // Vérifier si un ID a été fourni, sinon en générer un
    const employeeId = employeeData.id || generateUniqueEmployeeId();
    const data = { ...employeeData, id: employeeId };
    
    // Déterminer la collection cible en fonction du statut de manager
    const isManager = !!data.isManager;
    const collectionPath = isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    
    // Ajouter le document à Firestore
    await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    toast.success(`${isManager ? 'Manager' : 'Employé'} créé avec succès`);
    
    return {
      ...data,
      id: employeeId
    } as Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    toast.error("Erreur lors de la création de l'employé");
    throw error;
  }
};

/**
 * Mettre à jour un employé existant
 */
export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  try {
    // Récupérer l'employé actuel pour connaître sa collection
    const existingEmployee = await getEmployeeById(id);
    
    if (!existingEmployee) {
      throw new Error(`Employé avec l'ID ${id} introuvable`);
    }
    
    // Déterminer la collection source et cible
    const isManager = !!existingEmployee.isManager;
    const targetIsManager = data.isManager !== undefined ? !!data.isManager : isManager;
    
    const sourceCollection = isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    const targetCollection = targetIsManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    
    // Préparer les données à mettre à jour
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Si le statut de manager a changé, supprimer de l'ancienne collection et ajouter à la nouvelle
    if (isManager !== targetIsManager) {
      // Supprimer de la collection source
      await deleteDoc(doc(db, sourceCollection, id));
      
      // Ajouter à la collection cible
      const newData = {
        ...existingEmployee,
        ...updateData,
        isManager: targetIsManager
      };
      
      await addDoc(collection(db, targetCollection), newData);
      
      toast.success(`${targetIsManager ? 'Manager' : 'Employé'} mis à jour avec succès (changement de statut)`);
      
      return newData as Employee;
    } else {
      // Mise à jour normale sans changement de collection
      await updateDoc(doc(db, sourceCollection, id), updateData);
      
      toast.success(`${isManager ? 'Manager' : 'Employé'} mis à jour avec succès`);
      
      return {
        ...existingEmployee,
        ...updateData
      } as Employee;
    }
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    toast.error("Erreur lors de la mise à jour de l'employé");
    throw error;
  }
};

/**
 * Mettre à jour les compétences d'un employé
 */
export const updateEmployeeSkills = async (employeeId: string, skills: string[]): Promise<void> => {
  try {
    // Récupérer l'employé pour déterminer sa collection
    const employee = await getEmployeeById(employeeId);
    
    if (!employee) {
      throw new Error(`Employé avec l'ID ${employeeId} introuvable`);
    }
    
    // Déterminer la collection
    const collectionPath = employee.isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    
    // Mettre à jour les compétences
    await updateDoc(doc(db, collectionPath, employeeId), {
      skills,
      updatedAt: new Date().toISOString()
    });
    
    toast.success("Compétences mises à jour avec succès");
  } catch (error) {
    console.error(`Error updating skills for employee ${employeeId}:`, error);
    toast.error("Erreur lors de la mise à jour des compétences");
    throw error;
  }
};

/**
 * Supprimer un employé
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    // Récupérer l'employé pour déterminer sa collection
    const employee = await getEmployeeById(id);
    
    if (!employee) {
      throw new Error(`Employé avec l'ID ${id} introuvable`);
    }
    
    // Déterminer la collection
    const collectionPath = employee.isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    
    // Supprimer l'employé
    await deleteDoc(doc(db, collectionPath, id));
    
    toast.success(`${employee.isManager ? 'Manager' : 'Employé'} supprimé avec succès`);
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error);
    toast.error("Erreur lors de la suppression de l'employé");
    throw error;
  }
};

/**
 * Rafraîchir les données des employés (utilisé après des modifications)
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    return await getAllEmployees();
  } catch (error) {
    console.error('Error refreshing employees data:', error);
    toast.error('Erreur lors du rafraîchissement des données');
    throw error;
  }
};

/**
 * Créer plusieurs employés à la fois (importation en masse)
 */
export const createBulkEmployees = async (employees: Partial<Employee>[]): Promise<Employee[]> => {
  try {
    const results: Employee[] = [];
    
    for (const employeeData of employees) {
      // Générer un ID s'il n'y en a pas
      const employeeId = employeeData.id || generateUniqueEmployeeId();
      const data = { ...employeeData, id: employeeId };
      
      // Déterminer la collection cible
      const isManager = !!data.isManager;
      const collectionPath = isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
      
      // Ajouter le document à Firestore
      await addDoc(collection(db, collectionPath), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      results.push({
        ...data,
        id: employeeId,
        isManager
      } as Employee);
    }
    
    toast.success(`${results.length} employés créés avec succès`);
    
    return results;
  } catch (error) {
    console.error('Error creating bulk employees:', error);
    toast.error("Erreur lors de la création des employés en masse");
    throw error;
  }
};

/**
 * Obtenir des employés filtrés par critères
 */
export const getFilteredEmployees = async (
  filters: {
    department?: string;
    status?: string;
    position?: string;
    managerOnly?: boolean;
  }
): Promise<Employee[]> => {
  try {
    // Récupérer tous les employés
    let allEmployees = await getAllEmployees();
    
    // Appliquer les filtres
    return allEmployees.filter(emp => {
      // Filtrer par département
      if (filters.department && emp.department !== filters.department) {
        return false;
      }
      
      // Filtrer par statut
      if (filters.status && emp.status !== filters.status) {
        return false;
      }
      
      // Filtrer par position
      if (filters.position && emp.position !== filters.position) {
        return false;
      }
      
      // Filtrer par statut de manager
      if (filters.managerOnly === true && !emp.isManager) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error getting filtered employees:', error);
    toast.error("Erreur lors de la récupération des employés filtrés");
    throw error;
  }
};
