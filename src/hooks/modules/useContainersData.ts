
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import type { Container } from '@/types/freight';

export const useContainersData = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContainers = async () => {
      setIsLoading(true);
      try {
        // Check if collection path exists
        if (!COLLECTIONS.FREIGHT.CONTAINERS) {
          throw new Error('CONTAINERS collection path is not defined');
        }

        console.log(`Fetching containers from: ${COLLECTIONS.FREIGHT.CONTAINERS}`);
        
        // Get containers from Firestore
        const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
        const q = query(containersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        // Map document data to Container objects
        const containersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Container[];
        
        setContainers(containersData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching containers:', err);
        setError(err instanceof Error ? err : new Error('Error fetching containers'));
        setIsLoading(false);
        toast.error('Erreur lors du chargement des conteneurs');
      }
    };

    fetchContainers();
  }, []);

  return {
    containers,
    isLoading,
    error,
  };
};

export default useContainersData;
