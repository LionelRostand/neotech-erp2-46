
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { isEmployeeManager, employeeExists } from '@/components/module/submodules/employees/utils/employeeUtils';
import { toast } from 'sonner';

/**
 * Créer un nouvel employé avec vérification des doublons
 * @param employeeData Les données de l'employé à créer
 * @returns L'employé créé avec son ID
 */
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log('Tentative de création d\'un employé:', employeeData);
    
    // Vérifier si l'employé existe déjà avec le même email ou nom complet
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const existingEmailQuery = query(
      employeesRef, 
      where('email', '==', employeeData.email)
    );
    
    const existingProfEmailQuery = query(
      employeesRef, 
      where('professionalEmail', '==', employeeData.professionalEmail)
    );
    
    const [emailSnapshot, profEmailSnapshot] = await Promise.all([
      getDocs(existingEmailQuery),
      employeeData.professionalEmail ? getDocs(existingProfEmailQuery) : Promise.resolve({ empty: true })
    ]);
    
    if (!emailSnapshot.empty) {
      console.error('Un employé avec cet email existe déjà');
      toast.error('Un employé avec cet email existe déjà');
      return null;
    }
    
    if (!profEmailSnapshot.empty && employeeData.professionalEmail) {
      console.error('Un employé avec cet email professionnel existe déjà');
      toast.error('Un employé avec cet email professionnel existe déjà');
      return null;
    }
    
    // Déterminer si l'employé est un manager basé sur sa position
    const isManager = employeeData.isManager || 
                     isEmployeeManager(employeeData.position || '') || 
                     isEmployeeManager(employeeData.role || '');
    
    // Nettoyer les données pour éliminer les propriétés undefined
    const cleanedData = Object.entries(employeeData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    console.log('Données nettoyées avant sauvegarde:', cleanedData);
    
    // Préparer les données avec timestamps et statut de manager
    const now = new Date().toISOString();
    const employeeToSave: Partial<Employee> = {
      ...cleanedData,
      isManager,
      createdAt: now,
      updatedAt: now,
      status: employeeData.status || 'active'
    };
    
    // Ajouter l'employé à la collection employees
    const docRef = await addDoc(employeesRef, employeeToSave);
    console.log(`Employé créé avec ID: ${docRef.id}`);
    
    // Mise à jour avec l'ID
    const employeeWithId = {
      id: docRef.id,
      ...employeeToSave
    } as Employee;
    
    // Mettre à jour le document avec son ID
    await updateDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, docRef.id), { id: docRef.id });
    
    // Si c'est un manager, s'assurer qu'il est dans la collection des managers
    if (isManager) {
      console.log(`L'employé ${employeeWithId.firstName} ${employeeWithId.lastName} est un manager`);
      await syncManagerStatus(employeeWithId);
    }
    
    return employeeWithId;
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    toast.error(`Erreur lors de la création de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return null;
  }
};

/**
 * Mettre à jour un employé existant en utilisant updateDoc au lieu de addDoc
 * @param id L'ID de l'employé à mettre à jour
 * @param employeeData Les données de l'employé à mettre à jour
 * @returns L'employé mis à jour
 */
export const updateEmployeeDoc = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log(`Mise à jour de l'employé avec ID: ${id}`, employeeData);
    
    // Vérifier que l'employé existe avant de tenter une mise à jour
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`L'employé avec l'ID ${id} n'existe pas`);
      toast.error(`L'employé n'existe pas ou a été supprimé`);
      return null;
    }
    
    // Filtrer les données pour ne pas écraser l'ID ou createdAt
    const { id: _, createdAt, ...dataToUpdate } = employeeData;
    
    // Nettoyer les données pour éliminer les propriétés undefined
    const cleanedData = Object.entries(dataToUpdate).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    console.log('Données nettoyées avant mise à jour:', cleanedData);
    
    // Ajouter timestamp de mise à jour
    const updatedData = {
      ...cleanedData,
      updatedAt: new Date().toISOString()
    };
    
    // Mettre à jour le document existant
    await updateDoc(employeeRef, updatedData);
    
    // Récupérer le document mis à jour
    const updatedEmployeeDoc = await getDoc(employeeRef);
    
    if (!updatedEmployeeDoc.exists()) {
      console.error(`Échec de récupération du document mis à jour pour l'ID ${id}`);
      return null;
    }
    
    // Retourner l'employé mis à jour avec son ID
    const updatedEmployee = {
      id: id,
      ...updatedEmployeeDoc.data()
    } as Employee;
    
    console.log(`Employé mis à jour avec succès:`, updatedEmployee);
    
    return updatedEmployee;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'employé avec ID ${id}:`, error);
    toast.error(`Erreur lors de la mise à jour de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return null;
  }
};

/**
 * Synchroniser le statut de manager d'un employé
 * @param employee L'employé à synchroniser
 */
export const syncManagerStatus = async (employee: Employee): Promise<void> => {
  try {
    const managersRef = collection(db, COLLECTIONS.HR.MANAGERS);
    const managerQuery = query(managersRef, where('id', '==', employee.id));
    const managerSnapshot = await getDocs(managerQuery);
    
    if (managerSnapshot.empty && employee.isManager) {
      // Ajouter à la collection des managers s'il est manager et n'y est pas déjà
      console.log(`Ajout de ${employee.firstName} ${employee.lastName} à la collection des managers`);
      await addDoc(managersRef, {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position || employee.role,
        email: employee.email,
        department: employee.department,
        departmentId: employee.departmentId,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation du statut de manager:', error);
  }
};
