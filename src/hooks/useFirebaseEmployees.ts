
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  DocumentData,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { useToast } from '@/hooks/use-toast';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';

export const useFirebaseEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Updated reference to the correct HR employees collection path
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const q = query(employeesRef);
      
      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const employeesData: Employee[] = snapshot.docs.map(doc => {
          const data = doc.data();
          // Create a properly typed employee object with required fields and defaults
          return {
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            status: data.status || 'inactive',
            position: data.position || '',
            department: data.department || '',
            departmentId: data.departmentId || '',
            contract: data.contract || '',
            company: data.company || '',
            professionalEmail: data.professionalEmail || '',
            hireDate: data.hireDate?.toDate()?.toISOString() || null,
            birthDate: data.birthDate?.toDate()?.toISOString() || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            // Include other required fields with defaults
            photo: data.photo || '',
            photoURL: data.photoURL || '',
            socialSecurityNumber: data.socialSecurityNumber || '',
            startDate: data.startDate || '',
            manager: data.manager || '',
            managerId: data.managerId || '',
            title: data.title || '',
            role: data.role || '',
            payslips: data.payslips || [],
            // Include optional arrays
            skills: data.skills || [],
            documents: data.documents || [],
            education: data.education || []
          } as Employee;
        });
        
        setEmployees(employeesData);
        setIsLoading(false);
      }, (err) => {
        console.error("Error fetching employees:", err);
        setError(err);
        setIsLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des employés.",
          variant: "destructive",
        });
      });
      
      return unsubscribe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error("Error setting up employees listener:", error);
      setError(error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'initialisation du listener pour les employés.",
        variant: "destructive",
      });
      return () => {};
    }
  }, [toast]);

  // Vérifier les doublons potentiels
  const checkForDuplicates = async (employee: Omit<Employee, 'id'>, excludeId?: string): Promise<boolean> => {
    try {
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      
      // Vérifier le mail personnel
      if (employee.email) {
        const emailQuery = query(employeesRef, where('email', '==', employee.email));
        const emailSnapshot = await getDocs(emailQuery);
        
        for (const doc of emailSnapshot.docs) {
          if (doc.id !== excludeId) {
            toast({
              title: "Doublon détecté",
              description: `Un employé avec l'email ${employee.email} existe déjà.`,
              variant: "destructive",
            });
            return true;
          }
        }
      }
      
      // Vérifier le mail professionnel
      if (employee.professionalEmail) {
        const profEmailQuery = query(employeesRef, where('professionalEmail', '==', employee.professionalEmail));
        const profEmailSnapshot = await getDocs(profEmailQuery);
        
        for (const doc of profEmailSnapshot.docs) {
          if (doc.id !== excludeId) {
            toast({
              title: "Doublon détecté",
              description: `Un employé avec l'email professionnel ${employee.professionalEmail} existe déjà.`,
              variant: "destructive",
            });
            return true;
          }
        }
      }
      
      // Vérifier la combinaison nom/prénom comme avertissement
      if (employee.firstName && employee.lastName) {
        const nameQuery = query(
          employeesRef,
          where('firstName', '==', employee.firstName),
          where('lastName', '==', employee.lastName)
        );
        
        const nameSnapshot = await getDocs(nameQuery);
        
        for (const doc of nameSnapshot.docs) {
          if (doc.id !== excludeId) {
            toast({
              title: "Attention",
              description: `Un employé nommé ${employee.firstName} ${employee.lastName} existe déjà.`,
              variant: "warning",
            });
            // Ne pas bloquer pour les homonymes, mais avertir
            break;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error("Erreur lors de la vérification des doublons:", error);
      return false; // En cas d'erreur, continuer quand même
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Vérifier les doublons avant d'ajouter
      const hasDuplicates = await checkForDuplicates(employee);
      if (hasDuplicates) {
        throw new Error('Un employé avec des informations similaires existe déjà');
      }
      
      // Générer un ID unique pour le nouvel employé
      const employeeId = uuidv4();
      
      // Update reference to the employees collection
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
      
      // Prepare employee data
      const employeeData = {
        ...employee,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Use setDoc with the custom ID instead of addDoc
      await setDoc(employeeRef, employeeData);
      
      toast({
        title: "Succès",
        description: "L'employé a été ajouté avec succès.",
      });
      
      return { id: employeeId, ...employee };
    } catch (err) {
      console.error("Error adding employee:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'employé.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      // Vérifier les doublons avant de mettre à jour
      const hasDuplicates = await checkForDuplicates(updates as Omit<Employee, 'id'>, id);
      if (hasDuplicates) {
        throw new Error('Un employé avec des informations similaires existe déjà');
      }
      
      // Update reference to the employee document
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      
      // Update the document
      await updateDoc(employeeRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Succès",
        description: "Les informations de l'employé ont été mises à jour.",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating employee:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'employé.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      // Update reference to the employee document
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      
      // Delete the document
      await deleteDoc(employeeRef);
      
      toast({
        title: "Succès",
        description: "L'employé a été supprimé avec succès.",
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'employé.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    employees,
    isLoading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
