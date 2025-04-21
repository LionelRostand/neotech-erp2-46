
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import type { Container } from '@/types/freight';
import { useQuery } from '@tanstack/react-query';

// Function to fetch containers from Firestore
const fetchContainers = async (): Promise<Container[]> => {
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
    
    return containersData;
  } catch (err) {
    console.error('Error fetching containers:', err);
    const error = err instanceof Error ? err : new Error('Error fetching containers');
    toast.error('Erreur lors du chargement des conteneurs');
    throw error;
  }
};

// React Query hook for containers data
export const useContainersData = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: fetchContainers,
  });

  return {
    containers: data,
    isLoading,
    error,
  };
};

export default useContainersData;
