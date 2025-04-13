
import { prepareEmployeeData } from '../form/employeeUtils';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, Timestamp, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Fonction utilitaire pour déterminer si un employé est un responsable
const determineIfManager = (position: string | undefined): boolean => {
  if (!position) return false;
  
  const lowerPosition = position.toLowerCase();
  return lowerPosition.includes('manager') || 
         lowerPosition.includes('responsable') || 
         lowerPosition.includes('directeur') || 
         lowerPosition.includes('pdg');
};

export const createEmployee = async (employeeData: any) => {
  try {
    const newEmployeeId = uuidv4();
    const preparedData = prepareEmployeeData(employeeData, newEmployeeId);
    
    // Déterminer si l'employé est un responsable
    const isManager = determineIfManager(preparedData.position);
    
    const collectionPath = isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    const docRef = doc(db, collectionPath, newEmployeeId);
    
    await setDoc(docRef, {
      ...preparedData,
      isManager, // Ajouter explicitement le statut de responsable
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    const employeeSnap = await getDoc(docRef);
    
    if (employeeSnap.exists()) {
      const newEmployee = {
        ...employeeSnap.data(),
        id: employeeSnap.id,
        isManager
      } as Employee;
      
      toast.success(`Employé ${preparedData.firstName} ${preparedData.lastName} créé avec succès`);
      return newEmployee;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé', error);
    toast.error('Impossible de créer l\'employé');
    return null;
  }
};

export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const employeeDoc = await getDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
    const managerDoc = await getDoc(doc(db, COLLECTIONS.HR.MANAGERS, id));

    if (employeeDoc.exists()) {
      return { id: employeeDoc.id, ...employeeDoc.data() } as Employee;
    } else if (managerDoc.exists()) {
      return { id: managerDoc.id, ...managerDoc.data() } as Employee;
    } else {
      toast.error("Employé non trouvé");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'employé", error);
    toast.error("Erreur lors de la récupération de l'employé");
    return null;
  }
};

export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    // Déterminer si l'employé est un responsable
    const isManager = determineIfManager(employeeData.position);
    
    const collectionPath = isManager 
      ? COLLECTIONS.HR.MANAGERS 
      : COLLECTIONS.HR.EMPLOYEES;
    
    const docRef = doc(db, collectionPath, id);
    
    await updateDoc(docRef, {
      ...employeeData,
      isManager, // Mettre à jour le statut de responsable
      updatedAt: Timestamp.now()
    });
    
    const employeeSnap = await getDoc(docRef);
    
    if (employeeSnap.exists()) {
      const updatedEmployee = {
        ...employeeSnap.data(),
        id: employeeSnap.id,
        isManager
      } as Employee;
      
      toast.success(`Employé ${employeeData.firstName} ${employeeData.lastName} mis à jour avec succès`);
      return updatedEmployee;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé", error);
    toast.error("Erreur lors de la mise à jour de l'employé");
    return null;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    // Vérifier si l'employé existe dans la collection des employés
    const employeeDoc = await getDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
    
    // Vérifier si l'employé existe dans la collection des managers
    const managerDoc = await getDoc(doc(db, COLLECTIONS.HR.MANAGERS, id));
    
    if (employeeDoc.exists()) {
      // Supprimer l'employé de la collection des employés
      await deleteDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
      toast.success("Employé supprimé avec succès");
    } else if (managerDoc.exists()) {
      // Supprimer l'employé de la collection des managers
      await deleteDoc(doc(db, COLLECTIONS.HR.MANAGERS, id));
      toast.success("Manager supprimé avec succès");
    } else {
      toast.error("Employé non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé", error);
    toast.error("Erreur lors de la suppression de l'employé");
  }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Récupérer les employés réguliers
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const employeesQuery = query(employeesRef, orderBy('lastName', 'asc'));
    const employeesSnapshot = await getDocs(employeesQuery);
    
    // Récupérer les managers
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managersQuery = query(managersRef, orderBy('lastName', 'asc'));
    const managersSnapshot = await getDocs(managersQuery);
    
    // Combiner les deux ensembles de résultats
    const regularEmployees = employeesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        isManager: false
      } as Employee;
    });
    
    const managerEmployees = managersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        isManager: true
      } as Employee;
    });
    
    // Combiner et retourner tous les employés
    return [...regularEmployees, ...managerEmployees];
  } catch (error) {
    console.error("Erreur lors de la récupération des employés", error);
    toast.error("Erreur lors de la récupération des employés");
    return [];
  }
};

export const getEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const q = query(employeesRef, where("departmentId", "==", departmentId));
    const querySnapshot = await getDocs(q);
    const employees: Employee[] = [];
    querySnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() } as Employee);
    });
    return employees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés par département", error);
    toast.error("Erreur lors de la récupération des employés par département");
    return [];
  }
};

// Ajout des fonctions manquantes référencées dans les erreurs
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  return await getAllEmployees();
};

export const updateEmployeeSkills = async (employeeId: string, skills: string[]): Promise<Employee | null> => {
  return await updateEmployee(employeeId, { skills });
};
