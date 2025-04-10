import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Direct reference to the employees collection
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef);
      
      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const employeesData: Employee[] = snapshot.docs.map(doc => {
          const data = doc.data();
          // Create a properly typed employee object with required fields
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

  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Direct reference to the employees collection
      const employeesRef = collection(db, 'employees');
      
      // Prepare employee data
      const employeeData = {
        ...employee,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add the document
      const docRef = await addDoc(employeesRef, employeeData);
      
      toast({
        title: "Succès",
        description: "L'employé a été ajouté avec succès.",
      });
      
      return { id: docRef.id, ...employee };
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
      // Direct reference to the employee document
      const employeeRef = doc(db, 'employees', id);
      
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
      // Direct reference to the employee document
      const employeeRef = doc(db, 'employees', id);
      
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
