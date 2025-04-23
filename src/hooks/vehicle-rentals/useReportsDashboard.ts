
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface Vehicle {
  id: string;
  status: string;
  [key: string]: any;
}

interface Rental {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount?: number;
  [key: string]: any;
}

export const useReportsDashboard = () => {
  // Make sure we're using the correct collection paths
  const vehiclesPath = COLLECTIONS.TRANSPORT.VEHICLES;
  const reservationsPath = COLLECTIONS.TRANSPORT.RESERVATIONS;
  const invoicesPath = COLLECTIONS.TRANSPORT.INVOICES;
  
  console.log('Collection paths:', { vehiclesPath, reservationsPath, invoicesPath });

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(vehiclesPath)
  });

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ['rentals', 'rentals'],
    queryFn: () => fetchCollectionData<Rental>(reservationsPath)
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['rentals', 'invoices'],
    queryFn: () => fetchCollectionData<any>(invoicesPath)
  });

  const calculateStatistics = () => {
    const totalVehicles = vehicles.length;
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    
    // Calculate average rental duration, handling potential invalid dates
    const averageRentalDuration = rentals.length > 0 
      ? rentals.reduce((sum, rental) => {
          try {
            const start = new Date(rental.startDate);
            const end = new Date(rental.endDate);
            
            // Verify both dates are valid before calculating
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              return sum + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
            }
            return sum; // Skip invalid dates
          } catch (err) {
            console.error('Error calculating rental duration:', err);
            return sum; // Skip on error
          }
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
      try {
        // Validate the date before using it
        const rentalDate = new Date(rental.startDate);
        
        if (isNaN(rentalDate.getTime())) {
          console.warn('Invalid rental date:', rental.startDate, 'for rental:', rental.id);
          return; // Skip this rental
        }
        
        // Format as YYYY-MM
        const month = rentalDate.toISOString().slice(0, 7);
        const current = monthlyData.get(month) || { rentals: 0, revenue: 0 };
        
        monthlyData.set(month, {
          rentals: current.rentals + 1,
          revenue: current.revenue + (rental.totalAmount || 0)
        });
      } catch (err) {
        console.error('Error processing rental for chart data:', err, rental);
        // Skip this rental on error
      }
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
