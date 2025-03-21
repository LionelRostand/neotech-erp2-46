
import { useState, useEffect } from 'react';

export interface SalonStats {
  currentMonthRevenue: number;
  revenueChange: number;
  totalClients: number;
  newClientsThisMonth: number;
  occupancyRate: number;
  busyStylists: number;
  availableStylists: number;
  offStylists: number;
  totalStylists: number;
  totalAppointmentsToday: number;
  completedAppointments: number;
  totalAppointmentsWeek: number;
  lowStockProducts: number;
  totalProductsSold: number;
  loyaltyProgramMembers: number;
  topLoyaltyClients: LoyaltyClient[];
}

export interface SalonAlerts {
  newAppointments: number;
  pendingPayments: number;
  lowStockProducts: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface LoyaltyClient {
  name: string;
  points: number;
  status: 'gold' | 'silver' | 'bronze';
}

export const useSalonStats = () => {
  const [stats, setStats] = useState<SalonStats>({
    currentMonthRevenue: 7820,
    revenueChange: 12,
    totalClients: 345,
    newClientsThisMonth: 24,
    occupancyRate: 75,
    busyStylists: 3,
    availableStylists: 2,
    offStylists: 1,
    totalStylists: 6,
    totalAppointmentsToday: 18,
    completedAppointments: 8,
    totalAppointmentsWeek: 87,
    lowStockProducts: 5,
    totalProductsSold: 14,
    loyaltyProgramMembers: 187,
    topLoyaltyClients: [
      { name: "Marie Dupont", points: 450, status: 'gold' },
      { name: "Jean Martin", points: 320, status: 'silver' },
      { name: "Sophie Laurent", points: 280, status: 'silver' }
    ]
  });

  const [alerts, setAlerts] = useState<SalonAlerts>({
    newAppointments: 3,
    pendingPayments: 2,
    lowStockProducts: 5
  });

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([
    {
      id: "1",
      clientName: "Marie Lefort",
      phone: "06 12 34 56 78",
      service: "Coupe + Brushing",
      stylist: "Sophie Dupont",
      date: "Aujourd'hui",
      time: "10:00",
      duration: 60,
      status: "confirmed"
    },
    {
      id: "2",
      clientName: "Thomas Martin",
      phone: "06 23 45 67 89",
      service: "Coupe Homme",
      stylist: "Lucas Renard",
      date: "Aujourd'hui",
      time: "11:30",
      duration: 30,
      status: "completed"
    },
    {
      id: "3",
      clientName: "Julie Blanc",
      phone: "06 34 56 78 90",
      service: "Coloration",
      stylist: "Isabelle Meyer",
      date: "Aujourd'hui",
      time: "14:00",
      duration: 90,
      status: "confirmed"
    },
    {
      id: "4",
      clientName: "Pierre Dubois",
      phone: "06 45 67 89 01",
      service: "Coupe + Barbe",
      stylist: "Lucas Renard",
      date: "Aujourd'hui",
      time: "15:30",
      duration: 45,
      status: "pending"
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    {
      id: "5",
      clientName: "Camille Rousseau",
      phone: "06 56 78 90 12",
      service: "Balayage + Coupe",
      stylist: "Sophie Dupont",
      date: "Demain",
      time: "09:30",
      duration: 120,
      status: "confirmed"
    },
    {
      id: "6",
      clientName: "Nicolas Petit",
      phone: "06 67 89 01 23",
      service: "Coupe Homme",
      stylist: "Lucas Renard",
      date: "Demain",
      time: "11:00",
      duration: 30,
      status: "confirmed"
    },
    {
      id: "7",
      clientName: "Emma Bernard",
      phone: "06 78 90 12 34",
      service: "Mèches + Coupe",
      stylist: "Isabelle Meyer",
      date: "Après-demain",
      time: "14:30",
      duration: 150,
      status: "confirmed"
    }
  ]);

  const [revenueData, setRevenueData] = useState([
    { day: "01/06", revenue: 280 },
    { day: "02/06", revenue: 250 },
    { day: "03/06", revenue: 300 },
    { day: "04/06", revenue: 280 },
    { day: "05/06", revenue: 250 },
    { day: "06/06", revenue: 320 },
    { day: "07/06", revenue: 380 },
    { day: "08/06", revenue: 290 },
    { day: "09/06", revenue: 270 },
    { day: "10/06", revenue: 300 },
    { day: "11/06", revenue: 340 },
    { day: "12/06", revenue: 290 },
    { day: "13/06", revenue: 310 },
    { day: "14/06", revenue: 350 }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    stats,
    alerts,
    todayAppointments,
    upcomingAppointments,
    revenueData,
    isLoading,
    error
  };
};
