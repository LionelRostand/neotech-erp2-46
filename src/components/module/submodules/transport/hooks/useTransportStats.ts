
import { useEffect, useState } from 'react';

interface TransportStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  occupancyRate: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueChange: number;
  totalDrivers: number;
  activeDrivers: number;
  todayReservations: number;
  upcomingReservations: number;
  pendingPayments: number;
}

interface RevenueData {
  day: string;
  revenue: number;
}

interface Reservation {
  id: string;
  date: string;
  client: string;
  service: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

export const useTransportStats = (period: string) => {
  const [stats, setStats] = useState<TransportStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    inUseVehicles: 0,
    maintenanceVehicles: 0,
    occupancyRate: 0,
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    revenueChange: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    todayReservations: 0,
    upcomingReservations: 0,
    pendingPayments: 0
  });
  
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Simulate loading data based on selected period
    setTimeout(() => {
      // Different data values based on period
      let multiplier = 1;
      if (period === 'week') multiplier = 7;
      if (period === 'month') multiplier = 30;
      
      // Generate stats data
      const newStats: TransportStats = {
        totalVehicles: 35,
        availableVehicles: 23,
        inUseVehicles: 10,
        maintenanceVehicles: 2,
        occupancyRate: 29,
        currentMonthRevenue: 15800 * multiplier,
        previousMonthRevenue: 14200 * multiplier,
        revenueChange: 11,
        totalDrivers: 18,
        activeDrivers: 14,
        todayReservations: 8,
        upcomingReservations: 28,
        pendingPayments: 5
      };
      
      // Generate revenue data over time
      const daysData: RevenueData[] = [];
      const days = period === 'day' ? 14 : period === 'week' ? 12 : 6;
      
      for (let i = 1; i <= days; i++) {
        daysData.push({
          day: i.toString(),
          revenue: Math.floor(1000 + Math.random() * 1000) * multiplier
        });
      }
      
      // Generate recent reservations
      const reservations: Reservation[] = [
        {
          id: "TR-2023-001",
          date: "Aujourd'hui, 14:30",
          client: "Jean Dupont",
          service: "Transfert Aéroport",
          status: "success",
          statusText: "Confirmé"
        },
        {
          id: "TR-2023-002",
          date: "Aujourd'hui, 16:00",
          client: "Marie Legrand",
          service: "Location avec chauffeur",
          status: "warning",
          statusText: "En attente"
        },
        {
          id: "TR-2023-003",
          date: "Demain, 10:15",
          client: "Thomas Petit",
          service: "Transfert Gare",
          status: "success",
          statusText: "Confirmé"
        },
        {
          id: "TR-2023-004",
          date: "21/07/2023, 08:45",
          client: "Sophie Bernard",
          service: "Visite touristique",
          status: "danger",
          statusText: "Annulé"
        },
        {
          id: "TR-2023-005",
          date: "22/07/2023, 16:30",
          client: "Laurent Dubois",
          service: "Transfert Hôtel",
          status: "success",
          statusText: "Confirmé"
        }
      ];
      
      setStats(newStats);
      setRevenueData(daysData);
      setRecentReservations(reservations);
    }, 500);
  }, [period]);

  return { stats, revenueData, recentReservations };
};
