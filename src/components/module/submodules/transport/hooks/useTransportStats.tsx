
import { useState } from 'react';

export interface TransportStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  occupancyRate: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueChange: number;
  pendingPayments: number;
  todayReservations: number;
  upcomingReservations: number;
}

export interface RevenueDataPoint {
  day: string;
  revenue: number;
}

export interface Reservation {
  id: string;
  date: string;
  client: string;
  service: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

export const useTransportStats = (period: string = 'day') => {
  // Sample data for the dashboard
  const [stats] = useState<TransportStats>({
    totalVehicles: 48,
    availableVehicles: 32,
    inUseVehicles: 14,
    maintenanceVehicles: 2,
    totalDrivers: 26,
    activeDrivers: 21,
    occupancyRate: 67,
    currentMonthRevenue: 32450,
    previousMonthRevenue: 29800,
    revenueChange: 8.9,
    pendingPayments: 3,
    todayReservations: 8,
    upcomingReservations: 14
  });

  // Sample data for the revenue chart
  const [revenueData] = useState<RevenueDataPoint[]>([
    { day: '01', revenue: 1200 },
    { day: '02', revenue: 1400 },
    { day: '03', revenue: 1300 },
    { day: '04', revenue: 1500 },
    { day: '05', revenue: 1350 },
    { day: '06', revenue: 1700 },
    { day: '07', revenue: 1850 },
    { day: '08', revenue: 2000 },
    { day: '09', revenue: 1900 },
    { day: '10', revenue: 2200 },
    { day: '11', revenue: 2100 },
    { day: '12', revenue: 2300 },
    { day: '13', revenue: 2400 },
    { day: '14', revenue: 2600 },
  ]);

  // Sample data for recent reservations
  const [recentReservations] = useState<Reservation[]>([
    { id: "123", date: "2023-07-15", client: "Jean Dupont", service: "Transfert aéroport", status: "success", statusText: "Confirmée" },
    { id: "124", date: "2023-07-15", client: "Marie Legrand", service: "Location journée", status: "warning", statusText: "En attente" },
    { id: "125", date: "2023-07-16", client: "Paul Martin", service: "Transfert gare", status: "success", statusText: "Confirmée" },
    { id: "126", date: "2023-07-17", client: "Sophie Bernard", service: "Location weekend", status: "danger", statusText: "Annulée" },
    { id: "127", date: "2023-07-18", client: "Thomas Petit", service: "Chauffeur journée", status: "success", statusText: "Confirmée" },
  ]);

  return {
    stats,
    revenueData,
    recentReservations,
    period
  };
};
