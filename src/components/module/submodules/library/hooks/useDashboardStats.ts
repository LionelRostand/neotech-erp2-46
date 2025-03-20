
import { useState, useEffect } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAllDocuments } from '@/hooks/firestore/firestore-utils';

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  mostBorrowedBooks: {
    title: string;
    borrowCount: number;
  }[];
  loansByMonth: {
    month: string;
    loans: number;
    returns: number;
  }[];
  booksByCategory: {
    category: string;
    count: number;
  }[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0,
    mostBorrowedBooks: [],
    loansByMonth: [],
    booksByCategory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API or Firestore
        // For now, we'll simulate with mock data
        const mockStats: DashboardStats = {
          totalBooks: 2458,
          totalMembers: 562,
          activeLoans: 187,
          mostBorrowedBooks: [
            { title: "L'étranger", borrowCount: 38 },
            { title: "Voyage au bout de la nuit", borrowCount: 32 },
            { title: "Le Petit Prince", borrowCount: 29 },
            { title: "Candide", borrowCount: 25 },
            { title: "1984", borrowCount: 22 }
          ],
          loansByMonth: [
            { month: 'Jan', loans: 65, returns: 42 },
            { month: 'Fév', loans: 59, returns: 63 },
            { month: 'Mar', loans: 80, returns: 71 },
            { month: 'Avr', loans: 81, returns: 75 },
            { month: 'Mai', loans: 56, returns: 62 },
            { month: 'Juin', loans: 55, returns: 58 }
          ],
          booksByCategory: [
            { category: 'Roman', count: 845 },
            { category: 'Science', count: 423 },
            { category: 'Poésie', count: 148 },
            { category: 'Histoire', count: 392 },
            { category: 'Philosophie', count: 253 },
            { category: 'Autres', count: 397 }
          ]
        };

        // Try to get real data from Firestore
        try {
          const statsDoc = await getAllDocuments(COLLECTIONS.LIBRARY.STATS);
          if (statsDoc.length > 0) {
            setStats(statsDoc[0] as unknown as DashboardStats);
          } else {
            setStats(mockStats);
          }
        } catch (error) {
          console.log('Fallback to mock stats:', error);
          setStats(mockStats);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return { stats, loading };
};
