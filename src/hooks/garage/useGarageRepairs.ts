
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Repair } from '@/components/module/submodules/garage/types/garage-types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useGarageRepairs = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use direct Firestore query to get the data
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        console.log('Fetching garage repairs...');
        const collectionRef = collection(db, 'garage_repairs');
        const snapshot = await getDocs(collectionRef);
        
        const repairsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Repair[];
        
        console.log('Repairs data fetched:', repairsData);
        setRepairs(repairsData);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching garage repairs:', err);
        setError(err instanceof Error ? err : new Error(err.message));
        setIsLoading(false);
        toast.error(`Erreur lors du chargement des réparations: ${err.message}`);
      }
    };

    fetchRepairs();
  }, []);

  // Log for debugging
  console.log('useGarageRepairs hook state:', { repairs, isLoading, error });

  return {
    repairs,
    loading: isLoading,
    error
  };
};
