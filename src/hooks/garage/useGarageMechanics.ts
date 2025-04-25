
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string[] | string;
  email?: string;
  phone?: string;
  status?: 'available' | 'in_service' | 'off_duty' | 'on_leave';
  hireDate?: string;
  experience?: number;
}

export const useGarageMechanics = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchMechanics = async () => {
      setIsLoading(true);
      try {
        const mechanicsCollectionRef = collection(db, COLLECTIONS.GARAGE.MECHANICS);
        const snapshot = await getDocs(mechanicsCollectionRef);
        
        const mechanicsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mechanic[];
        
        setMechanics(mechanicsData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des mécaniciens:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        
        // Provide default mechanics if we can't fetch from database
        setMechanics([
          {
            id: 'mech1',
            firstName: 'Pierre',
            lastName: 'Martin',
            specialization: ['Mécanique générale', 'Diagnostic électronique'],
            email: 'pierre.martin@garage.com',
            phone: '0123456789',
            status: 'available',
            hireDate: '2020-05-15'
          },
          {
            id: 'mech2',
            firstName: 'Sophie',
            lastName: 'Dubois',
            specialization: ['Carrosserie', 'Peinture'],
            email: 'sophie.dubois@garage.com',
            phone: '0234567890',
            status: 'in_service',
            hireDate: '2018-09-10'
          }
        ]);
        
        toast.error(`Erreur lors du chargement des mécaniciens: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMechanics();
  }, []);
  
  return {
    mechanics,
    isLoading,
    error
  };
};
