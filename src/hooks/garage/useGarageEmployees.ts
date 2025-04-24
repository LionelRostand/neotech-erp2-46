
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
}

export const useGarageEmployees = () => {
  const [employees, setEmployees] = useState<GarageEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Utiliser la collection HR_EMPLOYEES
        const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
        const q = query(employeesRef);
        const snapshot = await getDocs(q);
        
        const employeesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            position: data.position || data.role || '',
          };
        });
        
        setEmployees(employeesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
        toast.error('Erreur lors du chargement des employés');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return {
    employees,
    loading
  };
};
