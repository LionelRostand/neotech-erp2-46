
import { useState, useEffect } from 'react';

export interface SalonStats {
  totalAppointments: number;
  totalRevenue: number;
  totalClients: number;
  newClients: number;
  appointmentsToday: number;
  availableStylists: number;
  busyStylists: number;
  offStylists: number;
  totalStylists: number;
  lowStockProducts: number;
  totalProductsSold: number;
  loyaltyProgramMembers: number;
  topLoyaltyClients: {
    id: string;
    name: string;
    points: number;
    visits: number;
  }[];
}

export interface SalonAlerts {
  newAppointments: number;
  pendingPayments: number;
  lowStockProducts: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  stylist: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  paid: boolean;
}

export const useSalonStats = () => {
  const [stats, setStats] = useState<SalonStats>({
    totalAppointments: 0,
    totalRevenue: 0,
    totalClients: 0,
    newClients: 0,
    appointmentsToday: 0,
    availableStylists: 0,
    busyStylists: 0,
    offStylists: 0,
    totalStylists: 0,
    lowStockProducts: 0,
    totalProductsSold: 0,
    loyaltyProgramMembers: 0,
    topLoyaltyClients: []
  });
  const [alerts, setAlerts] = useState<SalonAlerts>({
    newAppointments: 0,
    pendingPayments: 0,
    lowStockProducts: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalAppointments: 254,
          totalRevenue: 15840,
          totalClients: 187,
          newClients: 12,
          appointmentsToday: 8,
          availableStylists: 3,
          busyStylists: 2,
          offStylists: 1,
          totalStylists: 6,
          lowStockProducts: 3,
          totalProductsSold: 37,
          loyaltyProgramMembers: 84,
          topLoyaltyClients: [
            { id: '1', name: 'Émilie Laurent', points: 450, visits: 15 },
            { id: '2', name: 'Thomas Dubois', points: 380, visits: 12 },
            { id: '3', name: 'Camille Rousseau', points: 320, visits: 10 }
          ]
        });
        
        setAlerts({
          newAppointments: 3,
          pendingPayments: 2,
          lowStockProducts: 3
        });
        
        setTodayAppointments([
          { id: '1', clientName: 'Marie Dupont', service: 'Coupe et Brushing', stylist: 'Jean Valjean', time: '09:00', duration: 60, status: 'confirmed', price: 55, paid: true },
          { id: '2', clientName: 'Philippe Martin', service: 'Coloration', stylist: 'Sophie Leclerc', time: '10:30', duration: 120, status: 'confirmed', price: 85, paid: false },
          { id: '3', clientName: 'Anne Leroy', service: 'Brushing', stylist: 'Léa Dubois', time: '11:00', duration: 45, status: 'confirmed', price: 35, paid: false },
          { id: '4', clientName: 'David Bernard', service: 'Coupe Homme', stylist: 'Jean Valjean', time: '12:00', duration: 30, status: 'confirmed', price: 25, paid: true },
          { id: '5', clientName: 'Émilie Laurent', service: 'Coupe et Coloration', stylist: 'Sophie Leclerc', time: '14:00', duration: 150, status: 'confirmed', price: 110, paid: true },
          { id: '6', clientName: 'Nicolas Moreau', service: 'Coupe et Barbe', stylist: 'Léa Dubois', time: '15:30', duration: 60, status: 'confirmed', price: 45, paid: true },
          { id: '7', clientName: 'Camille Rousseau', service: 'Brushing', stylist: 'Jean Valjean', time: '16:30', duration: 45, status: 'pending', price: 35, paid: false },
          { id: '8', clientName: 'Thomas Dubois', service: 'Coupe Homme', stylist: 'Sophie Leclerc', time: '17:30', duration: 30, status: 'pending', price: 25, paid: false }
        ]);
        
        setUpcomingAppointments([
          { id: '9', clientName: 'Julie Lefebvre', service: 'Coupe et Brushing', stylist: 'Jean Valjean', time: 'Demain 09:30', duration: 60, status: 'confirmed', price: 55, paid: false },
          { id: '10', clientName: 'Pascal Girard', service: 'Coloration', stylist: 'Sophie Leclerc', time: 'Demain 11:00', duration: 120, status: 'confirmed', price: 85, paid: true },
          { id: '11', clientName: 'Sarah Petit', service: 'Coupe et Coloration', stylist: 'Léa Dubois', time: 'Demain 14:00', duration: 150, status: 'confirmed', price: 110, paid: false },
          { id: '12', clientName: 'Antoine Legrand', service: 'Coupe Homme', stylist: 'Jean Valjean', time: 'Après-demain 10:00', duration: 30, status: 'confirmed', price: 25, paid: true },
          { id: '13', clientName: 'Audrey Morel', service: 'Brushing', stylist: 'Sophie Leclerc', time: 'Après-demain 11:00', duration: 45, status: 'pending', price: 35, paid: false }
        ]);
        
        setRevenueData([
          { date: 'Lun', revenue: 580 },
          { date: 'Mar', revenue: 620 },
          { date: 'Mer', revenue: 750 },
          { date: 'Jeu', revenue: 680 },
          { date: 'Ven', revenue: 980 },
          { date: 'Sam', revenue: 1250 },
          { date: 'Dim', revenue: 450 }
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching salon data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch salon data'));
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
