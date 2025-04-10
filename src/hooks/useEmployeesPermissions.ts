
import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Defining employee user interface for permissions
export interface EmployeeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  department?: string;
  permissions?: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

// Définir les types pour les objets de permission
export interface EmployeePermission {
  id: string;
  employeeId: string;
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useEmployeesPermissions = () => {
  const [permissions, setPermissions] = useState<EmployeePermission[]>([]);
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load employees with permissions
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Reference to the employees collection
        const employeesRef = collection(db, 'employees');
        
        // Create a query to fetch employees
        const q = query(employeesRef);
        
        // Execute the query
        const querySnapshot = await getDocs(q);
        
        // Process the query results
        const employeesData: EmployeeUser[] = [];
        querySnapshot.forEach((doc) => {
          const employeeData = doc.data();
          employeesData.push({
            id: doc.id,
            firstName: employeeData.firstName || '',
            lastName: employeeData.lastName || '',
            email: employeeData.email || '',
            role: employeeData.role || employeeData.position || 'User',
            department: employeeData.department || '',
            permissions: employeeData.permissions || {}
          });
        });
        
        setEmployees(employeesData);
        console.log('Employees loaded:', employeesData.length);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('Failed to load employees data'));
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des employés.",
          variant: "destructive",
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  // Charger les permissions depuis Firestore
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // Utiliser le chemin direct à la collection
        const permissionsRef = collection(db, 'user_permissions');
        const q = query(permissionsRef);
        
        // Configurer un abonnement en temps réel
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const permissionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          })) as EmployeePermission[];
          
          setPermissions(permissionsData);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching permissions:", err);
          setError(err);
          setLoading(false);
          toast({
            title: "Erreur",
            description: "Impossible de charger les permissions des employés.",
            variant: "destructive",
          });
        });
        
        return unsubscribe;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
        console.error("Error setting up permissions listener:", error);
        setError(error);
        setLoading(false);
        return () => {};
      }
    };
    
    fetchPermissions();
  }, [toast]);

  // Ajouter une nouvelle permission
  const addPermission = async (permission: Omit<EmployeePermission, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Utiliser le chemin direct à la collection
      const permissionsRef = collection(db, 'user_permissions');
      
      const newPermission = {
        ...permission,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(permissionsRef, newPermission);
      
      toast({
        title: "Succès",
        description: "La permission a été ajoutée avec succès.",
      });
      
      return { id: docRef.id, ...newPermission };
    } catch (err) {
      console.error("Error adding permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Mettre à jour une permission existante
  const updatePermission = async (id: string, updates: Partial<EmployeePermission>) => {
    try {
      // Utiliser le chemin direct au document
      const permissionRef = doc(db, 'user_permissions', id);
      
      await updateDoc(permissionRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      toast({
        title: "Succès",
        description: "La permission a été mise à jour avec succès.",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update employee permissions by module
  const updateEmployeePermissions = async (employeeId: string, moduleId: string, permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }) => {
    // Update the local state first for UI responsiveness
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? {
              ...emp,
              permissions: {
                ...emp.permissions,
                [moduleId]: permissions
              }
            }
          : emp
      )
    );
    
    toast({
      title: "Succès",
      description: "Permissions mises à jour",
    });
    
    return true;
  };

  // Supprimer une permission
  const deletePermission = async (id: string) => {
    try {
      // Utiliser le chemin direct au document
      const permissionRef = doc(db, 'user_permissions', id);
      
      await deleteDoc(permissionRef);
      
      toast({
        title: "Succès",
        description: "La permission a été supprimée avec succès.",
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting permission:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la permission.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    permissions,
    employees,
    loading,
    isLoading: loading,
    error,
    addPermission,
    updatePermission,
    deletePermission,
    updateEmployeePermissions
  };
};
