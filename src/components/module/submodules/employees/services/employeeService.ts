
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { prepareEmployeeData } from '../form/employeeUtils';
import { EmployeeFormValues } from '../form/employeeFormSchema';

/**
 * Récupérer tous les employés (employés réguliers + managers)
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    const employees = employeesSnapshot.docs.map(doc => ({
      ...(doc.data() as Employee), 
      id: doc.id,
      isManager: false 
    }));
    
    // Récupérer les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersSnapshot = await getDocs(managersRef);
    const managers = managersSnapshot.docs.map(doc => ({
      ...(doc.data() as Employee), 
      id: doc.id,
      isManager: true 
    }));
    
    // Combiner les deux ensembles
    return [...employees, ...managers].sort((a, b) => 
      (a.lastName || '').localeCompare(b.lastName || '') || 0
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    toast.error('Impossible de récupérer la liste des employés');
    return [];
  }
};

/**
 * Récupérer un employé par son ID (recherche dans les deux collections)
 */
export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    // Vérifier d'abord dans la collection des employés réguliers
    const employeeDoc = await getDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId));
    if (employeeDoc.exists()) {
      return { 
        ...(employeeDoc.data() as Employee), 
        id: employeeDoc.id,
        isManager: false 
      };
    }
    
    // Sinon, vérifier dans la collection des managers
    const managerDoc = await getDoc(doc(db, COLLECTIONS.HR.MANAGERS, employeeId));
    if (managerDoc.exists()) {
      return { 
        ...(managerDoc.data() as Employee), 
        id: managerDoc.id,
        isManager: true 
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${employeeId} :`, error);
    toast.error('Impossible de récupérer les détails de l\'employé');
    return null;
  }
};

/**
 * Sauvegarder un nouvel employé ou mettre à jour un employé existant
 */
export const saveEmployee = async (data: EmployeeFormValues, employeeId?: string): Promise<string | null> => {
  try {
    const isNewEmployee = !employeeId || employeeId === 'new';
    const actualEmployeeId = isNewEmployee ? `EMP-${Date.now().toString(36).toUpperCase()}` : employeeId;
    
    // Préparer les données à enregistrer
    const employeeData = prepareEmployeeData(data, actualEmployeeId);
    
    // Déterminer si l'employé est un manager d'après son poste
    const isManager = employeeData.isManager || false;
    
    // Choisir la collection appropriée selon le type d'employé
    const collectionPath = isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
    
    // Enregistrer dans Firestore
    await setDoc(doc(db, collectionPath, actualEmployeeId), {
      ...employeeData,
      updatedAt: new Date().toISOString(),
      createdAt: isNewEmployee ? new Date().toISOString() : employeeData.createdAt
    });
    
    toast.success(isNewEmployee ? 'Employé créé avec succès' : 'Employé mis à jour avec succès');
    return actualEmployeeId;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'employé :', error);
    toast.error('Impossible d\'enregistrer l\'employé');
    return null;
  }
};

/**
 * Supprime un employé (de la collection appropriée)
 */
export const deleteEmployee = async (employeeId: string): Promise<boolean> => {
  try {
    // Récupérer d'abord l'employé pour savoir dans quelle collection il se trouve
    const employee = await getEmployeeById(employeeId);
    
    if (!employee) {
      toast.error('Employé non trouvé');
      return false;
    }
    
    // Déterminer la collection appropriée
    const collectionPath = employee.isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    // Supprimer le document
    await deleteDoc(doc(db, collectionPath, employeeId));
    
    toast.success('Employé supprimé avec succès');
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'employé ${employeeId} :`, error);
    toast.error('Impossible de supprimer l\'employé');
    return false;
  }
};

/**
 * Met à jour un employé existant (et gère le changement de collection si nécessaire)
 */
export const updateEmployee = async (employeeId: string, data: EmployeeFormValues): Promise<boolean> => {
  try {
    // Récupérer l'employé actuel
    const currentEmployee = await getEmployeeById(employeeId);
    
    if (!currentEmployee) {
      toast.error('Employé non trouvé');
      return false;
    }
    
    // Préparer les nouvelles données
    const updatedEmployeeData = prepareEmployeeData(data, employeeId);
    
    // Déterminer si le statut de manager a changé
    const wasManager = currentEmployee.isManager;
    const isNowManager = updatedEmployeeData.isManager || false;
    
    // Si le statut de manager a changé, nous devons déplacer l'employé vers l'autre collection
    if (wasManager !== isNowManager) {
      // Supprimer de l'ancienne collection
      await deleteDoc(doc(db, 
        wasManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES, 
        employeeId));
      
      // Ajouter à la nouvelle collection
      await setDoc(doc(db, 
        isNowManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES, 
        employeeId), {
        ...updatedEmployeeData,
        updatedAt: new Date().toISOString(),
        createdAt: currentEmployee.createdAt
      });
    } else {
      // Mettre à jour dans la collection actuelle
      const collectionPath = wasManager 
        ? COLLECTIONS.HR.MANAGERS 
        : COLLECTIONS.HR.EMPLOYEES;
      
      await updateDoc(doc(db, collectionPath, employeeId), {
        ...updatedEmployeeData,
        updatedAt: new Date().toISOString()
      });
    }
    
    toast.success('Employé mis à jour avec succès');
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'employé ${employeeId} :`, error);
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
    const searchTermLower = searchTerm.toLowerCase();
    const results: Employee[] = [];
    
    // Rechercher parmi les employés réguliers
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesSnapshot = await getDocs(employeesRef);
    
    employeesSnapshot.forEach(doc => {
      const data = doc.data() as Employee;
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      const email = (data.email || '').toLowerCase();
      
      if (fullName.includes(searchTermLower) || email.includes(searchTermLower)) {
        results.push({ ...data, id: doc.id, isManager: false });
      }
    });
    
    // Rechercher parmi les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersSnapshot = await getDocs(managersRef);
    
    managersSnapshot.forEach(doc => {
      const data = doc.data() as Employee;
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      const email = (data.email || '').toLowerCase();
      
      if (fullName.includes(searchTermLower) || email.includes(searchTermLower)) {
        results.push({ ...data, id: doc.id, isManager: true });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'employés :', error);
    toast.error('Erreur lors de la recherche');
    return [];
  }
};

/**
 * Récupérer les employés par département
 */
export const getEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers du département
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesQuery = query(employeesRef, 
      where('departmentId', '==', departmentId)
    );
    const employeesSnapshot = await getDocs(employeesQuery);
    const employees = employeesSnapshot.docs.map(doc => ({
      ...(doc.data() as Employee), 
      id: doc.id,
      isManager: false 
    }));
    
    // Récupérer les managers du département
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersQuery = query(managersRef, 
      where('departmentId', '==', departmentId)
    );
    const managersSnapshot = await getDocs(managersQuery);
    const managers = managersSnapshot.docs.map(doc => ({
      ...(doc.data() as Employee), 
      id: doc.id,
      isManager: true 
    }));
    
    // Combiner et trier par nom
    return [...employees, ...managers].sort((a, b) => 
      (a.lastName || '').localeCompare(b.lastName || '') || 0
    );
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés du département ${departmentId} :`, error);
    toast.error('Impossible de récupérer les employés du département');
    return [];
  }
};

/**
 * Fonction pour rafraîchir les données des employés
 * Cette fonction est utilisée pour recharger les données après des modifications
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    return await getAllEmployees();
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des données des employés :', error);
    toast.error('Impossible de rafraîchir les données');
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
  getEmployeesByDepartment,
  refreshEmployeesData
};
