
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle, Rental } from '../components/module/submodules/vehicle-rentals/types/rental-types';

export const useReportsDashboard = () => {
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ['rentals', 'rentals'],
    queryFn: () => fetchCollectionData<Rental>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['rentals', 'invoices'],
    queryFn: () => fetchCollectionData<any>(COLLECTIONS.TRANSPORT.INVOICES)
  });

  const calculateStatistics = () => {
    const totalVehicles = vehicles.length;
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const averageRentalDuration = rentals.length > 0 
      ? rentals.reduce((sum, rental) => {
          const start = new Date(rental.startDate);
          const end = new Date(rental.endDate);
          return sum + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        }, 0) / rentals.length
      : 0;

    return {
      totalVehicles,
      activeRentals,
      totalRevenue,
      averageRentalDuration: Math.round(averageRentalDuration)
    };
  };

  const prepareChartData = () => {
    const monthlyData = new Map<string, { rentals: number; revenue: number }>();

    rentals.forEach(rental => {
      const month = new Date(rental.startDate).toISOString().slice(0, 7);
      const current = monthlyData.get(month) || { rentals: 0, revenue: 0 };
      monthlyData.set(month, {
        rentals: current.rentals + 1,
        revenue: current.revenue + (rental.totalAmount || 0)
      });
    });

    return Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month,
        rentals: data.rentals,
        revenue: data.revenue
      }));
  };

  return {
    statistics: calculateStatistics(),
    chartData: prepareChartData(),
    isLoading: isLoadingVehicles || isLoadingRentals || isLoadingInvoices
  };
};
