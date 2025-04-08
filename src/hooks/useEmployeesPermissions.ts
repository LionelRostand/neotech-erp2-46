
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { isNetworkError, reconnectToFirestore } from './firestore/network-handler';

// Basic user type for permissions
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

export const useEmployeesPermissions = () => {
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Reference to the employees collection
        const employeesRef = collection(db, COLLECTIONS.EMPLOYEES);
        
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
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        
        // Check if it's a network error
        if (isNetworkError(err)) {
          console.log('Network error detected when fetching employees, app is offline');
          toast.error('Erreur de connexion: L\'application est hors ligne.');
          
          // Try to reconnect
          await reconnectToFirestore();
        } else {
          setError('Failed to load employees data');
          toast.error('Erreur lors du chargement des données employés');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const updateEmployeePermissions = async (
    employeeId: string, 
    moduleId: string, 
    permissions: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    }
  ) => {
    try {
      // First update local state for immediate UI feedback
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
      
      // Then try to update in Firestore
      const employeeDocRef = doc(db, COLLECTIONS.EMPLOYEES, employeeId);
      
      // We need to update just the specific module permissions
      await updateDoc(employeeDocRef, {
        [`permissions.${moduleId}`]: permissions
      });
      
      toast.success('Permissions mises à jour');
      return true;
    } catch (err: any) {
      console.error('Error updating employee permissions:', err);
      
      // Check if it's a network error
      if (isNetworkError(err)) {
        toast.error('Impossible de mettre à jour les permissions: Mode hors ligne');
      } else {
        toast.error(`Erreur lors de la mise à jour des permissions: ${err.message}`);
      }
      
      return false;
    }
  };

  return {
    employees,
    isLoading,
    error,
    updateEmployeePermissions
  };
};
