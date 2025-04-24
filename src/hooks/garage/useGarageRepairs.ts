
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Repair } from '@/components/module/submodules/garage/types/garage-types';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';

export const useGarageRepairs = () => {
  // Utiliser useFirebaseCollection pour avoir les mises à jour en temps réel
  const { data = [], isLoading, error } = useFirebaseCollection<Repair>(
    COLLECTIONS.GARAGE?.REPAIRS || 'invalid_collection_placeholder'
  );

  // Ajouter des logs pour déboguer
  console.log('useGarageRepairs - data:', data);
  console.log('useGarageRepairs - isLoading:', isLoading);
  console.log('useGarageRepairs - error:', error);

  return {
    repairs: data,
    loading: isLoading,
    error
  };
};
