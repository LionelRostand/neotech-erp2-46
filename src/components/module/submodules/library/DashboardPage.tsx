
import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, User, BookOpen, Calendar } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import StatCard from '@/components/StatCard';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAllDocuments } from '@/hooks/firestore/firestore-utils';

// Define types for dashboard data
interface DashboardStats {
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

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const DashboardPage: React.FC = () => {
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

  // Chart configs
  const chartConfig = {
    loans: { 
      label: "Emprunts", 
      theme: { light: "#8B5CF6", dark: "#A78BFA" }
    },
    returns: { 
      label: "Retours", 
      theme: { light: "#10B981", dark: "#34D399" }
    },
    roman: { 
      label: "Roman", 
      theme: { light: "#8B5CF6", dark: "#A78BFA" }
    },
    science: { 
      label: "Science", 
      theme: { light: "#EC4899", dark: "#F472B6" }
    },
    poesie: { 
      label: "Poésie", 
      theme: { light: "#10B981", dark: "#34D399" }
    },
    histoire: { 
      label: "Histoire", 
      theme: { light: "#F59E0B", dark: "#FBBF24" }
    },
    philosophie: { 
      label: "Philosophie", 
      theme: { light: "#EF4444", dark: "#F87171" }
    },
    autres: { 
      label: "Autres", 
      theme: { light: "#6366F1", dark: "#818CF8" }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Bibliothèque</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Livres"
          value={stats.totalBooks.toString()}
          icon={<BookOpen className="h-6 w-6 text-purple-500" />}
          description="Nombre total de livres dans la collection"
        />
        <StatCard
          title="Adhérents"
          value={stats.totalMembers.toString()}
          icon={<User className="h-6 w-6 text-indigo-500" />}
          description="Nombre d'adhérents actifs"
        />
        <StatCard
          title="Emprunts Actifs"
          value={stats.activeLoans.toString()}
          icon={<Calendar className="h-6 w-6 text-emerald-500" />}
          description="Emprunts en cours"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Loans Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Emprunts et Retours (6 derniers mois)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <RechartsBarChart data={stats.loansByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="loans" name="loans" fill="var(--color-loans)" />
                <Bar dataKey="returns" name="returns" fill="var(--color-returns)" />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <span>Livres par Catégorie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <RechartsPieChart>
                <Pie
                  data={stats.booksByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="category"
                >
                  {stats.booksByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Borrowed Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Livres les plus empruntés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-medium">Titre</th>
                  <th className="p-3 font-medium text-right">Nombre d'emprunts</th>
                </tr>
              </thead>
              <tbody>
                {stats.mostBorrowedBooks.map((book, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{book.title}</td>
                    <td className="p-3 text-right font-mono">{book.borrowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
