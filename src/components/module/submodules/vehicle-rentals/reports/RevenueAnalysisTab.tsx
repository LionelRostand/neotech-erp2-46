
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Euro, TrendingUp, PercentIcon, BadgeEuro } from "lucide-react";
import StatCard from '@/components/StatCard';

interface RevenueAnalysisTabProps {
  timeRange: string;
}

// Mock revenue data
const getRevenueData = () => [
  { name: 'Jan', revenus: 12500, couts: 6200 },
  { name: 'Fév', revenus: 14800, couts: 6500 },
  { name: 'Mar', revenus: 16000, couts: 7200 },
  { name: 'Avr', revenus: 17200, couts: 7600 },
  { name: 'Mai', revenus: 19000, couts: 8100 },
  { name: 'Juin', revenus: 22000, couts: 9000 },
];

// Revenue breakdown
const getRevenueBreakdown = () => [
  { name: 'Locations standard', value: 68 },
  { name: 'Options & extras', value: 15 },
  { name: 'Assurances', value: 10 },
  { name: 'Frais divers', value: 7 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const RevenueAnalysisTab: React.FC<RevenueAnalysisTabProps> = ({ timeRange }) => {
  const revenueData = getRevenueData();
  const revenueBreakdown = getRevenueBreakdown();
  
  // Calculate summary metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenus, 0);
  const totalCosts = revenueData.reduce((sum, item) => sum + item.couts, 0);
  const profitMargin = Math.round(((totalRevenue - totalCosts) / totalRevenue) * 100);
  const averageDailyRevenue = Math.round(totalRevenue / 180); // Mock value for 6 months
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenus totaux"
          value={formatCurrency(totalRevenue)}
          icon={<Euro className="h-5 w-5 text-green-500" />}
          description="Sur la période"
        />
        <StatCard
          title="Marge bénéficiaire"
          value={`${profitMargin}%`}
          icon={<PercentIcon className="h-5 w-5 text-blue-500" />}
          description="Sur la période"
        />
        <StatCard
          title="Revenue journalier"
          value={formatCurrency(averageDailyRevenue)}
          icon={<BadgeEuro className="h-5 w-5 text-amber-500" />}
          description="Moyenne sur la période"
        />
        <StatCard
          title="Croissance"
          value="+18%"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          description="Vs période précédente"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus et coûts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), '']}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenus" 
                    name="Revenus" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    dot={{ strokeWidth: 2 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="couts" 
                    name="Coûts" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueAnalysisTab;
