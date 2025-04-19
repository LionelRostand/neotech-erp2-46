
import React from 'react';
import { LineChart, BarChart, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import AnalyticsTable from '@/components/analytics/AnalyticsTable';

const Performance = () => {
  const { stats, monthlyData, loading } = useAnalyticsData();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500">Analyse détaillée des performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard 
              title="Chiffre d'affaires" 
              value={formatCurrency(stats.revenue, 'EUR')}
              icon={<LineChart className="text-primary" size={20} />}
              description={`${stats.growth > 0 ? '+' : ''}${stats.growth}% ce mois`}
            />
            <StatCard 
              title="Nouveaux clients" 
              value={stats.newCustomers.toString()}
              icon={<Users className="text-primary" size={20} />}
              description="Depuis le mois dernier"
            />
            <StatCard 
              title="Satisfaction client" 
              value={`${stats.satisfaction}%`}
              icon={<TrendingUp className="text-primary" size={20} />}
              description="Score moyen"
            />
            <StatCard 
              title="Taux de conversion" 
              value="15.3%"
              icon={<BarChart className="text-primary" size={20} />}
              description="+2.4% ce mois"
            />
          </>
        )}
      </div>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Évolution mensuelle</h2>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === "Chiffre d'affaires") {
                      return [formatCurrency(value as number, 'EUR'), name];
                    }
                    return [value, name];
                  }} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    name="Chiffre d'affaires"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#16a34a" 
                    name="Clients"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <AnalyticsTable />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
