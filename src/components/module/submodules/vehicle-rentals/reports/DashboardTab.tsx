
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportsDashboard } from '@/hooks/vehicle-rentals/useReportsDashboard';
import StatCard from '@/components/StatCard';
import { Car, CalendarCheck, DollarSign, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DashboardTab = () => {
  const { statistics, chartData, isLoading } = useReportsDashboard();

  if (isLoading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total véhicules"
          value={statistics.totalVehicles.toString()}
          icon={<Car className="h-5 w-5 text-blue-500" />}
          description="Tous véhicules confondus"
        />
        <StatCard
          title="Locations actives"
          value={statistics.activeRentals.toString()}
          icon={<CalendarCheck className="h-5 w-5 text-green-500" />}
          description="En cours"
        />
        <StatCard
          title="Revenus totaux"
          value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(statistics.totalRevenue)}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          description="Toutes périodes"
        />
        <StatCard
          title="Durée moyenne"
          value={`${statistics.averageRentalDuration} jours`}
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          description="Par location"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Locations']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rentals" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
