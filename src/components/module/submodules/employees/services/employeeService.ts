
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Récupère la liste des employés depuis Firestore
 */
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log('Récupération des employés depuis Firestore...');
    
    // Utiliser le chemin correct pour la collection des employés
    const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
    const q = query(employeesRef, orderBy('lastName', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const employees = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        position: data.position || '',
        department: data.department || '',
        status: data.status || 'active',
        hireDate: data.hireDate || null,
        company: data.company || '',
        contract: data.contract || 'CDI',
        manager: data.manager || '',
        photo: data.photo || '',
        photoURL: data.photoURL || '',
        // Autres champs facultatifs avec valeurs par défaut
        professionalEmail: data.professionalEmail || '',
        skills: data.skills || [],
        documents: data.documents || [],
        education: data.education || []
      } as Employee;
    });
    
    console.log(`${employees.length} employés récupérés`);
    return employees;
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    toast.error('Erreur lors du chargement des employés');
    return [];
  }
};

/**
 * Ajoute un nouvel employé à Firestore
 */
export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    const employeeData = {
      ...employee,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.EMPLOYEES), employeeData);
    toast.success('Employé ajouté avec succès');
    
    return {
      id: docRef.id,
      ...employee
    } as Employee;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'employé:', error);
    toast.error('Erreur lors de l\'ajout de l\'employé');
    return null;
  }
};

/**
 * Met à jour un employé existant dans Firestore
 */
export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<boolean> => {
  try {
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, COLLECTIONS.HR.EMPLOYEES), updatedData);
    toast.success('Employé mis à jour avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    toast.error('Erreur lors de la mise à jour de l\'employé');
    return false;
  }
};

/**
 * Supprime un employé de Firestore
 */
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.HR.EMPLOYEES, id));
    toast.success('Employé supprimé avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    toast.error('Erreur lors de la suppression de l\'employé');
    return false;
  }
};
