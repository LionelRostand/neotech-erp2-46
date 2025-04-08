
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

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
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees data');
        toast.error('Erreur lors du chargement des données employés');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const updateEmployeePermissions = async (employeeId: string, moduleId: string, permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }) => {
    // This would be implemented to update permissions in Firebase
    // For now we're just updating the local state
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
    
    toast.success('Permissions mises à jour');
    return true;
  };

  return {
    employees,
    isLoading,
    error,
    updateEmployeePermissions
  };
};
