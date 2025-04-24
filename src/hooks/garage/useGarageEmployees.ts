
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
  phone?: string;
  status?: 'active' | 'busy' | 'onLeave';
}

export const useGarageEmployees = () => {
  const [employees, setEmployees] = useState<GarageEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Make sure we have a valid collection path before proceeding
        if (!COLLECTIONS.HR || !COLLECTIONS.HR.EMPLOYEES) {
          console.error('COLLECTIONS.HR.EMPLOYEES is not defined');
          toast.error('Erreur de configuration: collection HR.EMPLOYEES non définie');
          setLoading(false);
          return;
        }

        console.log('Fetching employees from collection:', COLLECTIONS.HR.EMPLOYEES);
        
        // Use the HR_EMPLOYEES collection
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
            phone: data.phone || '',
            status: data.status || 'active',
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
