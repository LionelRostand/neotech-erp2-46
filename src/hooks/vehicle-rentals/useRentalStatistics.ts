
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle, Reservation, Client } from '../components/module/submodules/vehicle-rentals/types/rental-types';

export interface RentalStatistics {
  totalReservations: number;
  activeReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  averageDuration: number;
  totalRevenue: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  reservationsByStatus: {
    status: string;
    count: number;
  }[];
}

export const useRentalStatistics = () => {
  const { data: reservations = [] } = useQuery({
    queryKey: ['rentals', 'reservations'],
    queryFn: () => fetchCollectionData<Reservation>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['rentals', 'invoices'],
    queryFn: () => fetchCollectionData<any>(COLLECTIONS.TRANSPORT.INVOICES)
  });

  const statistics: RentalStatistics = {
    totalReservations: reservations.length,
    activeReservations: reservations.filter(r => r.status === 'active').length,
    completedReservations: reservations.filter(r => r.status === 'completed').length,
    cancelledReservations: reservations.filter(r => r.status === 'cancelled').length,
    averageDuration: calculateAverageDuration(reservations),
    totalRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
    revenueByMonth: calculateRevenueByMonth(invoices),
    reservationsByStatus: calculateReservationsByStatus(reservations)
  };

  return {
    statistics,
    isLoading: false,
    error: null
  };
};

const calculateAverageDuration = (reservations: Reservation[]): number => {
  if (reservations.length === 0) return 0;
  
  const durations = reservations.map(res => {
    const start = new Date(res.startDate);
    const end = new Date(res.endDate);
    return (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Convert to days
  });
  
  return Math.round(durations.reduce((sum, duration) => sum + duration, 0) / reservations.length);
};

const calculateRevenueByMonth = (invoices: any[]): { month: string; revenue: number }[] => {
  const revenueMap = new Map<string, number>();
  
  invoices.forEach(invoice => {
    if (!invoice.createdAt) return;
    const date = new Date(invoice.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    revenueMap.set(monthKey, (revenueMap.get(monthKey) || 0) + (invoice.amount || 0));
  });
  
  return Array.from(revenueMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const calculateReservationsByStatus = (reservations: Reservation[]): { status: string; count: number }[] => {
  const statusMap = new Map<string, number>();
  
  reservations.forEach(res => {
    statusMap.set(res.status, (statusMap.get(res.status) || 0) + 1);
  });
  
  return Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }));
};
