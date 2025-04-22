
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useAccountingData = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['freight', 'billing'],
    queryFn: () => fetchCollectionData('freight_billing'),
  });

  return {
    invoices,
    isLoading,
  };
};
