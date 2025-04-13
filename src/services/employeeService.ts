
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
      getDocs(existingProfEmailQuery)
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
    
    // Préparer les données avec timestamps et statut de manager
    const now = new Date().toISOString();
    const employeeToSave: Partial<Employee> = {
      ...employeeData,
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
    toast.error('Erreur lors de la création de l\'employé');
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
