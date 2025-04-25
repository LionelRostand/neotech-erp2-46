
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface GarageService {
  id: string;
  date: string;
  vehicleInfo: string;
  description: string;
  mechanicName: string;
  status: string;
  progress: number;
}

interface ServiceStats {
  today: number;
  inProgress: number;
  waitingParts: number;
  total: number;
}

export const useGarageServices = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<GarageService>(COLLECTIONS.GARAGE.SERVICES),
  });

  const servicesStats: ServiceStats = {
    today: services.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length,
    inProgress: services.filter(s => s.status === 'in_progress').length,
    waitingParts: services.filter(s => s.status === 'waiting_parts').length,
    total: services.length
  };

  return {
    services,
    servicesStats,
    isLoading
  };
};
