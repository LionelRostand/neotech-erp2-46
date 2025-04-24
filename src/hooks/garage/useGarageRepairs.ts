
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Repair } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageRepairs = () => {
  const { data: repairs = [], isLoading } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(
      COLLECTIONS.GARAGE?.REPAIRS || 'invalid_collection_placeholder'
    ),
  });

  return {
    repairs,
    loading: isLoading
  };
};
