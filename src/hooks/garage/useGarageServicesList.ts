
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Service } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageServicesList = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['garage', 'services-list'],
    queryFn: async () => {
      try {
        console.log('Fetching services from collection:', COLLECTIONS.GARAGE.SERVICES);
        const result = await fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES);
        console.log('Services fetched:', result);
        return result;
      } catch (err) {
        console.error('Error fetching services:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Format services for dropdown options
  const servicesOptions = services.map(service => ({
    value: service.id,
    label: `${service.name} - ${service.cost}€`
  }));

  return {
    services,
    servicesOptions,
    isLoading
  };
};
