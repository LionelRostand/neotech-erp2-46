
import React from 'react';
import { LineChart, BarChart, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const Analytics = () => {
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
              value={`€${stats.revenue.toLocaleString()}`}
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
              title="Croissance" 
              value={`${stats.growth}%`}
              icon={<BarChart className="text-primary" size={20} />}
              description="Evolution mensuelle"
            />
          </>
        )}
      </div>

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
                <Tooltip />
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
    </DashboardLayout>
  );
};

export default Analytics;
