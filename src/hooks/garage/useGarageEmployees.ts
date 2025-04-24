
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageEmployees = () => {
  // Ensure we have a valid collection path
  const mechanicsPath = COLLECTIONS.GARAGE?.MECHANICS || 'garage_mechanics';
  
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(mechanicsPath),
  });

  return {
    employees,
    loading: isLoading
  };
};
