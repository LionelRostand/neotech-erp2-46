
import { useState, useEffect } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';

export interface SalonStats {
  totalRevenue: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueChange: number;
  totalClients: number;
  newClientsThisMonth: number;
  occupancyRate: number;
  totalStylists: number;
  availableStylists: number;
  busyStylists: number;
  offStylists: number;
  totalAppointmentsToday: number;
  totalAppointmentsWeek: number;
  completedAppointments: number;
}

export interface SalonAlerts {
  newAppointments: number;
  pendingPayments: number;
  lowStockProducts: number;
}

export interface Appointment {
  id: string;
  date: string;
  clientName: string;
  service: string;
  stylist: string;
  duration: number;
  status: "confirmé" | "en attente" | "annulé";
}

interface SalonStatsReturn {
  stats: SalonStats;
  alerts: SalonAlerts;
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  revenueData: Array<{
    day: string;
    revenue: number;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export const useSalonStats = (): SalonStatsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<SalonStats>({
    totalRevenue: 0,
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    revenueChange: 0,
    totalClients: 0,
    newClientsThisMonth: 0,
    occupancyRate: 0,
    totalStylists: 0,
    availableStylists: 0,
    busyStylists: 0,
    offStylists: 0,
    totalAppointmentsToday: 0,
    totalAppointmentsWeek: 0,
    completedAppointments: 0
  });
  const [alerts, setAlerts] = useState<SalonAlerts>({
    newAppointments: 0,
    pendingPayments: 0,
    lowStockProducts: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<Array<{day: string; revenue: number}>>([]);

  // Utiliser le hook Firestore
  const firestore = useSafeFirestore('salon-stats');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Dans un vrai scénario, ces données viendraient de Firestore
        // Ici nous simulons des données pour la démo
        
        // Simulation de délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données factices pour la démo
        setStats({
          totalRevenue: 28450,
          currentMonthRevenue: 8320,
          previousMonthRevenue: 7650,
          revenueChange: 8.8,
          totalClients: 387,
          newClientsThisMonth: 24,
          occupancyRate: 78,
          totalStylists: 6,
          availableStylists: 2,
          busyStylists: 3,
          offStylists: 1,
          totalAppointmentsToday: 18,
          totalAppointmentsWeek: 87,
          completedAppointments: 14
        });
        
        setAlerts({
          newAppointments: 5,
          pendingPayments: 3,
          lowStockProducts: 7
        });
        
        setTodayAppointments([
          { id: "1", date: "10:00", clientName: "Sophie Martin", service: "Coupe & Brushing", stylist: "Jean Dupont", duration: 60, status: "confirmé" },
          { id: "2", date: "11:30", clientName: "Marie Lambert", service: "Coloration", stylist: "Lucie Blanc", duration: 90, status: "confirmé" },
          { id: "3", date: "14:00", clientName: "Thomas Petit", service: "Coupe Homme", stylist: "Marc Lefebvre", duration: 30, status: "en attente" },
          { id: "4", date: "15:30", clientName: "Julie Dubois", service: "Balayage", stylist: "Emma Rousseau", duration: 120, status: "confirmé" },
          { id: "5", date: "17:30", clientName: "Philippe Moreau", service: "Coupe & Barbe", stylist: "Jean Dupont", duration: 60, status: "confirmé" }
        ]);
        
        setUpcomingAppointments([
          { id: "6", date: "Demain 9:30", clientName: "Claire Leroy", service: "Coupe & Brushing", stylist: "Lucie Blanc", duration: 60, status: "confirmé" },
          { id: "7", date: "Demain 14:00", clientName: "Alexandre Girard", service: "Coupe Homme", stylist: "Jean Dupont", duration: 30, status: "confirmé" },
          { id: "8", date: "Après-demain 11:00", clientName: "Isabelle Fournier", service: "Mèches", stylist: "Emma Rousseau", duration: 150, status: "en attente" }
        ]);
        
        setRevenueData([
          { day: "Lun", revenue: 620 },
          { day: "Mar", revenue: 580 },
          { day: "Mer", revenue: 750 },
          { day: "Jeu", revenue: 495 },
          { day: "Ven", revenue: 890 },
          { day: "Sam", revenue: 1250 },
          { day: "Dim", revenue: 0 },
          { day: "Lun", revenue: 680 },
          { day: "Mar", revenue: 720 },
          { day: "Mer", revenue: 850 },
          { day: "Jeu", revenue: 740 },
          { day: "Ven", revenue: 915 },
          { day: "Sam", revenue: 1380 },
          { day: "Dim", revenue: 0 }
        ]);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        console.error('Erreur lors du chargement des données du salon:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
