
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';

/**
 * Détermine la collection appropriée pour un employé selon son rôle
 * @param employee Données de l'employé
 * @returns Chemin de la collection où enregistrer l'employé
 */
const getEmployeeCollection = (employee: Partial<Employee>): string => {
  // Vérifier si l'employé est un manager
  const isManager = employee.position?.toLowerCase().includes('manager') ||
                    employee.position?.toLowerCase().includes('directeur') ||
                    employee.role?.toLowerCase().includes('manager') ||
                    employee.role?.toLowerCase().includes('directeur');
  
  // Retourner la collection appropriée
  return isManager ? COLLECTIONS.HR.MANAGERS : COLLECTIONS.HR.EMPLOYEES;
};

/**
 * Fetch employees data from Firestore (both regular employees and managers)
 */
export const fetchEmployeesData = async (): Promise<Employee[]> => {
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
    const allEmployees = [
      ...employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isManager: false
      } as Employee)),
      ...managersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isManager: true
      } as Employee))
    ];
    
    // Trier par nom de famille
    return allEmployees.sort((a, b) => a.lastName.localeCompare(b.lastName));
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
 * Get an employee by ID (checks both collections)
 */
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Vérifier d'abord dans la collection des employés standard
    let docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    let docSnap = await getDoc(docRef);
    
    // Si l'employé n'est pas trouvé, vérifier dans la collection des managers
    if (!docSnap.exists()) {
      docRef = doc(db, COLLECTIONS.HR.MANAGERS, id);
      docSnap = await getDoc(docRef);
    }
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const isManager = docRef.path.includes(COLLECTIONS.HR.MANAGERS);
      
      return {
        id: docSnap.id,
        ...data,
        isManager
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
    
    // Vérifier dans les deux collections
    const collections = [COLLECTIONS.HR.EMPLOYEES, COLLECTIONS.HR.MANAGERS];
    
    for (const collectionPath of collections) {
      const employeesRef = collection(db, collectionPath);
      
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
      
      if (isDuplicate) break;
      
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
      
      if (isDuplicate) break;
      
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
    }
    
    return isDuplicate;
  } catch (error) {
    console.error('Erreur lors de la vérification des doublons:', error);
    return false; // En cas d'erreur, on laisse passer (mais idéalement, on devrait gérer mieux)
  }
};

/**
 * Add a new employee with a custom ID
 */
export const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<string | null> => {
  try {
    // Vérifier les doublons avant d'ajouter
    const isDuplicate = await checkEmployeeDuplicate(employeeData);
    
    if (isDuplicate) {
      toast.error('Un employé avec des informations similaires existe déjà');
      return null;
    }
    
    // Générer un ID unique pour le nouvel employé
    const employeeId = uuidv4();
    
    // Déterminer la collection appropriée (managers ou employés)
    const collectionPath = getEmployeeCollection(employeeData);
    
    console.log(`Ajout d'un nouvel employé dans la collection: ${collectionPath}`);
    
    // Utiliser setDoc avec l'ID personnalisé au lieu de addDoc
    const docRef = doc(db, collectionPath, employeeId);
    await setDoc(docRef, employeeData);
    
    toast.success(`${employeeData.firstName} ${employeeData.lastName} a été ajouté avec succès`);
    
    return employeeId;
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
    
    // Déterminer si l'employé est un manager ou un employé régulier
    const oldEmployeeData = await getEmployeeById(id);
    
    // Déterminer la nouvelle collection en fonction des nouvelles données
    const newCollectionPath = getEmployeeCollection(data);
    
    // Déterminer la collection d'origine
    const oldCollectionPath = oldEmployeeData?.isManager ? 
                              COLLECTIONS.HR.MANAGERS : 
                              COLLECTIONS.HR.EMPLOYEES;
    
    // Si la collection a changé (promotion/rétrogradation), supprimer de l'ancienne et créer dans la nouvelle
    if (oldCollectionPath !== newCollectionPath) {
      console.log(`Changement de statut: ${oldCollectionPath} -> ${newCollectionPath}`);
      
      // Supprimer de l'ancienne collection
      const oldDocRef = doc(db, oldCollectionPath, id);
      await deleteDoc(oldDocRef);
      
      // Créer dans la nouvelle collection
      const newDocRef = doc(db, newCollectionPath, id);
      const updatedData = {
        ...oldEmployeeData,
        ...data,
        updatedAt: new Date().toISOString()
      };
      await setDoc(newDocRef, updatedData);
      
      toast.success(`${data.firstName || oldEmployeeData?.firstName} ${data.lastName || oldEmployeeData?.lastName} a été mis à jour avec succès (changement de statut)`);
      return true;
    }
    
    // Si pas de changement de collection, simplement mettre à jour
    const docRef = doc(db, newCollectionPath, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    toast.success(`${data.firstName || oldEmployeeData?.firstName} ${data.lastName || oldEmployeeData?.lastName} a été mis à jour avec succès`);
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
    // Vérifier dans quelle collection se trouve l'employé
    const employee = await getEmployeeById(id);
    
    if (!employee) {
      toast.error("Employé non trouvé");
      return false;
    }
    
    const collectionPath = employee.isManager ? 
                          COLLECTIONS.HR.MANAGERS : 
                          COLLECTIONS.HR.EMPLOYEES;
    
    // Supprimer l'employé de la collection appropriée
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef);
    
    toast.success(`${employee.firstName} ${employee.lastName} a été supprimé avec succès`);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    toast.error('Error deleting employee');
    return false;
  }
};

/**
 * Mettre à jour les compétences d'un employé
 */
export const updateEmployeeSkills = async (id: string, skills: string[]): Promise<boolean> => {
  try {
    // Vérifier dans quelle collection se trouve l'employé
    const employee = await getEmployeeById(id);
    
    if (!employee) {
      toast.error("Employé non trouvé");
      return false;
    }
    
    const collectionPath = employee.isManager ? 
                          COLLECTIONS.HR.MANAGERS : 
                          COLLECTIONS.HR.EMPLOYEES;
    
    // Mettre à jour les compétences
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, {
      skills: skills,
      updatedAt: new Date().toISOString()
    });
    
    toast.success('Compétences mises à jour avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des compétences:', error);
    toast.error('Erreur lors de la mise à jour des compétences');
    return false;
  }
};
