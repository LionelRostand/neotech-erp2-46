
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types for the reports data
export interface SalesData {
  period: string;
  revenue: number;
  growth: number;
  serviceBreakdown: Array<{name: string, count: number, revenue: number, percentage: number}>;
  stylistPerformance: Array<{name: string, clients: number, revenue: number}>;
  monthlyRevenue: Array<{month: string, revenue: number}>;
}

export interface AppointmentsData {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  appointmentsOverTime: Array<{date: string, count: number}>;
  mostPopularTimes: Array<{time: string, count: number}>;
  clientRetention: number;
  newClients: number;
  returningClients: number;
  activeClients: number;
  clientsOverTime: Array<{month: string, new: number, returning: number}>;
}

export interface ProductSalesData {
  totalSold: number;
  totalRevenue: number;
  topProducts: Array<{name: string, sold: number, revenue: number}>;
  categorySales: Array<{category: string, sold: number, revenue: number}>;
  salesOverTime: Array<{date: string, sold: number, revenue: number}>;
  lowStock: Array<{name: string, stock: number, minStock: number}>;
  inventory: {
    total: number;
    value: number;
    stockTurnover: number;
  };
}

export const useSalonReports = (timeRange: string) => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<AppointmentsData | null>(null);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      setIsLoading(true);
      try {
        // In a real application, we would fetch from an API with the timeRange parameter
        // For demo purposes, we'll use mock data
        
        // Mock Sales Performance Data
        const mockSalesData: SalesData = {
          period: timeRange === 'week' ? '7 derniers jours' : 
                 timeRange === 'month' ? '30 derniers jours' : 
                 timeRange === 'quarter' ? 'Ce trimestre' : 'Cette année',
          revenue: timeRange === 'week' ? 4850 : 
                  timeRange === 'month' ? 18500 : 
                  timeRange === 'quarter' ? 52000 : 178500,
          growth: timeRange === 'week' ? 8.5 : 
                 timeRange === 'month' ? 12.3 : 
                 timeRange === 'quarter' ? 7.8 : 15.4,
          serviceBreakdown: [
            { name: "Coupe & Brushing", count: 124, revenue: 5580, percentage: 27 },
            { name: "Coloration", count: 86, revenue: 7740, percentage: 19 },
            { name: "Balayage", count: 62, revenue: 6510, percentage: 14 },
            { name: "Coupe Homme", count: 78, revenue: 2340, percentage: 17 },
            { name: "Mèches", count: 46, revenue: 4830, percentage: 10 },
            { name: "Coupe & Barbe", count: 38, revenue: 1995, percentage: 8 },
            { name: "Autres", count: 23, revenue: 1380, percentage: 5 }
          ],
          stylistPerformance: [
            { name: "Sophie Martin", clients: 58, revenue: 6240 },
            { name: "Jean Dupont", clients: 52, revenue: 5850 },
            { name: "Claire Dubois", clients: 45, revenue: 4950 },
            { name: "Thomas Richard", clients: 38, revenue: 3420 },
            { name: "Emma Leroy", clients: 33, revenue: 3180 }
          ],
          monthlyRevenue: [
            { month: "Jan", revenue: 14500 },
            { month: "Fév", revenue: 13800 },
            { month: "Mar", revenue: 15200 },
            { month: "Avr", revenue: 16500 },
            { month: "Mai", revenue: 15800 },
            { month: "Juin", revenue: 17200 },
            { month: "Juil", revenue: 18500 },
            { month: "Août", revenue: 16900 },
            { month: "Sep", revenue: 17500 },
            { month: "Oct", revenue: 18200 },
            { month: "Nov", revenue: 17800 },
            { month: "Déc", revenue: 16500 }
          ]
        };
        
        // Mock Appointments & Clients Data
        const mockAppointmentsData: AppointmentsData = {
          total: timeRange === 'week' ? 87 : 
                timeRange === 'month' ? 342 : 
                timeRange === 'quarter' ? 980 : 3650,
          completed: timeRange === 'week' ? 76 : 
                    timeRange === 'month' ? 312 : 
                    timeRange === 'quarter' ? 890 : 3380,
          cancelled: timeRange === 'week' ? 8 : 
                    timeRange === 'month' ? 24 : 
                    timeRange === 'quarter' ? 75 : 210,
          noShow: timeRange === 'week' ? 3 : 
                 timeRange === 'month' ? 6 : 
                 timeRange === 'quarter' ? 15 : 60,
          appointmentsOverTime: [
            { date: "Lun", count: 12 },
            { date: "Mar", count: 14 },
            { date: "Mer", count: 10 },
            { date: "Jeu", count: 15 },
            { date: "Ven", count: 18 },
            { date: "Sam", count: 22 },
            { date: "Dim", count: 8 }
          ],
          mostPopularTimes: [
            { time: "10:00", count: 42 },
            { time: "11:00", count: 38 },
            { time: "14:00", count: 45 },
            { time: "15:00", count: 52 },
            { time: "16:00", count: 48 }
          ],
          clientRetention: 76.5,
          newClients: timeRange === 'week' ? 12 : 
                     timeRange === 'month' ? 45 : 
                     timeRange === 'quarter' ? 135 : 480,
          returningClients: timeRange === 'week' ? 64 : 
                           timeRange === 'month' ? 267 : 
                           timeRange === 'quarter' ? 755 : 2900,
          activeClients: 320,
          clientsOverTime: [
            { month: "Jan", new: 38, returning: 242 },
            { month: "Fév", new: 42, returning: 236 },
            { month: "Mar", new: 35, returning: 250 },
            { month: "Avr", new: 48, returning: 255 },
            { month: "Mai", new: 40, returning: 260 },
            { month: "Juin", new: 45, returning: 268 },
            { month: "Juil", new: 55, returning: 272 },
            { month: "Août", new: 42, returning: 265 },
            { month: "Sep", new: 38, returning: 270 },
            { month: "Oct", new: 44, returning: 276 },
            { month: "Nov", new: 42, returning: 280 },
            { month: "Déc", new: 35, returning: 275 }
          ]
        };
        
        // Mock Product Sales Data
        const mockProductSalesData: ProductSalesData = {
          totalSold: timeRange === 'week' ? 38 : 
                   timeRange === 'month' ? 145 : 
                   timeRange === 'quarter' ? 420 : 1650,
          totalRevenue: timeRange === 'week' ? 1250 : 
                      timeRange === 'month' ? 4850 : 
                      timeRange === 'quarter' ? 13500 : 48200,
          topProducts: [
            { name: "Shampooing Kérastase", sold: 28, revenue: 980 },
            { name: "Huile Moroccanoil", sold: 22, revenue: 770 },
            { name: "Masque L'Oréal", sold: 18, revenue: 630 },
            { name: "Spray Volumisant", sold: 16, revenue: 480 },
            { name: "Gel Fixation Forte", sold: 15, revenue: 225 }
          ],
          categorySales: [
            { category: "Shampooing", sold: 58, revenue: 1740 },
            { category: "Soins", sold: 45, revenue: 1580 },
            { category: "Coiffage", sold: 32, revenue: 960 },
            { category: "Coloration", sold: 15, revenue: 870 },
            { category: "Accessoires", sold: 12, revenue: 360 }
          ],
          salesOverTime: [
            { date: "Lun", sold: 5, revenue: 175 },
            { date: "Mar", sold: 7, revenue: 245 },
            { date: "Mer", sold: 4, revenue: 140 },
            { date: "Jeu", sold: 6, revenue: 210 },
            { date: "Ven", sold: 8, revenue: 280 },
            { date: "Sam", sold: 12, revenue: 420 },
            { date: "Dim", sold: 3, revenue: 105 }
          ],
          lowStock: [
            { name: "Shampooing Réparateur", stock: 3, minStock: 5 },
            { name: "Masque Hydratant", stock: 2, minStock: 5 },
            { name: "Sérum Anti-Frisottis", stock: 2, minStock: 4 }
          ],
          inventory: {
            total: 325,
            value: 9850,
            stockTurnover: 4.2
          }
        };

        // Simulate API delay
        setTimeout(() => {
          setSalesData(mockSalesData);
          setAppointmentsData(mockAppointmentsData);
          setProductSalesData(mockProductSalesData);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch reports data'));
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, [timeRange]);

  return {
    salesData,
    appointmentsData,
    productSalesData,
    isLoading,
    error
  };
};
