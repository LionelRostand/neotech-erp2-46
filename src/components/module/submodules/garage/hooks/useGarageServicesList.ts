
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Service } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageServicesList = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'services-list'],
    queryFn: () => fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES),
  });

  // Transform services into the format needed for MultiSelect
  const servicesOptions = services.map(service => ({
    value: service.id,
    label: `${service.name} - ${service.cost}€`
  }));

  return {
    services,
    servicesOptions,
    isLoading,
    error
  };
};
