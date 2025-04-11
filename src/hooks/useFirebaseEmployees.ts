
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
  DocumentData,
  getDoc
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
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      const q = query(employeesRef);
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const employeesData: Employee[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId || uuidv4(),
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
            hireDate: data.hireDate?.toDate()?.toISOString() || '',
            birthDate: data.birthDate?.toDate()?.toISOString() || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            photo: data.photo || '',
            photoURL: data.photoURL || '',
            socialSecurityNumber: data.socialSecurityNumber || '',
            startDate: data.startDate || '',
            manager: data.manager || '',
            managerId: data.managerId || '',
            title: data.title || '',
            role: data.role || '',
            payslips: data.payslips || [],
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
      const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
      
      // Nettoyage des données pour éviter les valeurs undefined
      const cleanedData = Object.entries(employee).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;
        
        if (key === 'address' && typeof value === 'object') {
          // Nettoyage spécifique pour l'objet adresse
          const cleanAddress = Object.entries(value).reduce((addrAcc, [addrKey, addrVal]) => {
            if (addrVal !== undefined) {
              addrAcc[addrKey] = addrVal;
            }
            return addrAcc;
          }, {} as Record<string, any>);
          
          // Seulement ajouter l'adresse si elle a au moins une propriété
          if (Object.keys(cleanAddress).length > 0) {
            acc[key] = cleanAddress;
          }
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      // S'assurer que photoURL est inclus si photo est défini
      if (cleanedData.photo && !cleanedData.photoURL) {
        cleanedData.photoURL = cleanedData.photo;
      } else if (cleanedData.photoURL && !cleanedData.photo) {
        cleanedData.photo = cleanedData.photoURL;
      }
      
      const employeeData = {
        ...cleanedData,
        userId: employee.userId || uuidv4(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log("Ajout d'employé avec données:", employeeData);
      const docRef = await addDoc(employeesRef, employeeData);
      
      toast({
        title: "Succès",
        description: "L'employé a été ajouté avec succès.",
      });
      
      return { id: docRef.id, ...employee };
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'employé:", err);
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
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      
      // Nettoyage des données pour éviter les valeurs undefined
      const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;
        
        if (key === 'address' && typeof value === 'object') {
          // Nettoyage spécifique pour l'objet adresse
          const cleanAddress = Object.entries(value).reduce((addrAcc, [addrKey, addrVal]) => {
            if (addrVal !== undefined) {
              addrAcc[addrKey] = addrVal;
            }
            return addrAcc;
          }, {} as Record<string, any>);
          
          // Seulement mettre à jour l'adresse si elle a au moins une propriété
          if (Object.keys(cleanAddress).length > 0) {
            acc[key] = cleanAddress;
          }
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      // Synchroniser photo et photoURL
      if (cleanedUpdates.photo && !cleanedUpdates.photoURL) {
        cleanedUpdates.photoURL = cleanedUpdates.photo;
      } else if (cleanedUpdates.photoURL && !cleanedUpdates.photo) {
        cleanedUpdates.photo = cleanedUpdates.photoURL;
      }
      
      await updateDoc(employeeRef, {
        ...cleanedUpdates,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Succès",
        description: "Les informations de l'employé ont été mises à jour.",
      });
      
      // Force refresh the employees list
      const employeeDoc = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      // Fix: Using getDoc instead of calling .get() directly on the reference
      const employeeSnapshot = await getDoc(employeeDoc);
      
      if (employeeSnapshot.exists()) {
        const updatedEmployee = { 
          id, 
          ...employeeSnapshot.data(),
          ...cleanedUpdates 
        } as Employee;
        
        setEmployees(prev => 
          prev.map(emp => emp.id === id ? updatedEmployee : emp)
        );
      }
      
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
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, id);
      
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
