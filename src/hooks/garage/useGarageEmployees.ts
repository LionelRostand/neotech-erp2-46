
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageEmployees = () => {
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(
      COLLECTIONS.GARAGE?.MECHANICS || 'invalid_collection_placeholder'
    ),
  });

  return {
    employees,
    loading: isLoading
  };
};
