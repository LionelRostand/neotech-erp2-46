
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc, DocumentReference } from 'firebase/firestore';
import { Employee } from '@/types/employee';
import { notifyDepartmentUpdates } from '@/components/module/submodules/departments/utils/departmentUtils';

/**
 * Créer un nouvel employé dans Firestore
 * @param employeeData Les données de l'employé à créer
 * @returns L'employé créé avec son ID
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log('Creating employee in Firestore:', employeeData);
    
    // Vérifier si un employé avec cet email existe déjà
    if (employeeData.email) {
      const emailQuery = query(
        collection(db, COLLECTIONS.HR.EMPLOYEES),
        where("email", "==", employeeData.email)
      );
      const querySnapshot = await getDocs(emailQuery);
      
      if (!querySnapshot.empty) {
        console.error('Un employé avec cet email existe déjà:', employeeData.email);
        throw new Error('Un employé avec cet email existe déjà');
      }
    }
    
    // S'assurer que la photo est correctement assignée
    const photoURL = employeeData.photoURL || employeeData.photo || '';
    
    // Ajouter l'employé à la collection hr_employees
    const collectionRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const docRef = await addDoc(collectionRef, {
      ...employeeData,
      photoURL: photoURL,
      photo: photoURL, // Garder la compatibilité avec les deux champs
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: employeeData.status || 'active'
    });
    
    // Récupérer l'employé créé avec son ID
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const newEmployee = {
        id: docSnap.id,
        ...docSnap.data()
      } as Employee;
      
      // Si c'est un manager, l'ajouter à la liste des managers
      if (newEmployee.isManager || employeeData.forceManager) {
        await addManagerToList(newEmployee);
      }
      
      console.log('Employee created successfully:', newEmployee);
      
      // Déclencher une mise à jour de la hiérarchie
      triggerHierarchyUpdate();
      
      return newEmployee;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Mettre à jour un employé existant
 * @param id ID de l'employé à mettre à jour
 * @param data Nouvelles données
 * @returns L'employé mis à jour
 */
export const updateEmployeeDoc = async (id: string, data: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log('Updating employee with ID:', id, 'Data:', data);
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    
    // S'assurer que la photo est correctement mise à jour
    const photoURL = data.photoURL || data.photo || '';
    
    // Clean data to remove any undefined values that would cause Firebase errors
    const cleanData = { ...data };
    
    // Handle the address specifically to avoid undefined fields
    if (cleanData.address && typeof cleanData.address === 'object') {
      cleanData.address = Object.entries(cleanData.address).reduce((acc: any, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
    }
    
    // Préparer les données de mise à jour
    const updateData = {
      ...cleanData,
      photoURL: photoURL || undefined,
      photo: photoURL || undefined, // Garder la compatibilité avec les deux champs
      updatedAt: new Date().toISOString()
    };
    
    // Remove any properties with undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    await updateDoc(docRef, updateData);
    console.log('Update successful, fetching updated employee data');
    
    // Récupérer l'employé mis à jour
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const updatedEmployee = {
        id: docSnap.id,
        ...docSnap.data()
      } as Employee;
      
      console.log('Employee updated successfully:', updatedEmployee);
      
      // Déclencher une mise à jour de la hiérarchie après la mise à jour d'un employé
      triggerHierarchyUpdate();
      
      return updatedEmployee;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Ajouter ou retirer un employé de la liste des managers
 * @param employee L'employé à synchroniser
 */
export const syncManagerStatus = async (employee: Employee): Promise<void> => {
  try {
    const isManager = employee.isManager || employee.forceManager;
    
    // Vérifier si l'employé est déjà dans la liste des managers
    const managerQuery = query(
      collection(db, COLLECTIONS.HR.MANAGERS),
      where("employeeId", "==", employee.id)
    );
    const querySnapshot = await getDocs(managerQuery);
    
    // Si c'est un manager et qu'il n'est pas dans la liste, l'ajouter
    if (isManager && querySnapshot.empty) {
      await addManagerToList(employee);
    }
    // Si ce n'est plus un manager mais qu'il est dans la liste, le retirer
    else if (!isManager && !querySnapshot.empty) {
      const managerId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, COLLECTIONS.HR.MANAGERS, managerId));
    }
    
    // Déclencher une mise à jour de la hiérarchie après la modification du statut de manager
    triggerHierarchyUpdate();
  } catch (error) {
    console.error('Error syncing manager status:', error);
    throw error;
  }
};

/**
 * Ajouter un employé à la liste des managers
 * @param employee L'employé à ajouter comme manager
 */
const addManagerToList = async (employee: Employee): Promise<void> => {
  try {
    await addDoc(collection(db, COLLECTIONS.HR.MANAGERS), {
      employeeId: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      department: employee.department,
      photoURL: employee.photoURL || employee.photo,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding employee to managers list:', error);
    throw error;
  }
};

/**
 * Déclenche une mise à jour de la hiérarchie en notifiant les composants concernés
 * Cette fonction utilise le même mécanisme que pour les mises à jour des départements
 */
export const triggerHierarchyUpdate = (): void => {
  console.log('Triggering hierarchy update after employee changes');
  // Utiliser le système de notification existant pour les départements
  // puisque la hiérarchie dépend à la fois des employés et des départements
  notifyDepartmentUpdates();
};
