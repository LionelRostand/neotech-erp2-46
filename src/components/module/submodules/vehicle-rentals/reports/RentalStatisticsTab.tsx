
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRentalStatistics } from '@/hooks/vehicle-rentals/useRentalStatistics';
import { Calendar, DollarSign, Clock, Ban } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '@/components/StatCard';

interface RentalStatisticsTabProps {
  timeRange: string;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const RentalStatisticsTab: React.FC<RentalStatisticsTabProps> = () => {
  const { statistics } = useRentalStatistics();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Réservations"
          value={statistics.totalReservations.toString()}
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          description="Toutes périodes"
        />
        <StatCard
          title="Réservations Actives"
          value={statistics.activeReservations.toString()}
          icon={<Clock className="h-5 w-5 text-green-500" />}
          description="En cours"
        />
        <StatCard
          title="Revenus Totaux"
          value={formatCurrency(statistics.totalRevenue)}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          description="Toutes périodes"
        />
        <StatCard
          title="Taux d'annulation"
          value={`${Math.round((statistics.cancelledReservations / statistics.totalReservations) * 100)}%`}
          icon={<Ban className="h-5 w-5 text-red-500" />}
          description="Des réservations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Revenus']}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
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
            <CardTitle>Répartition des réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.reservationsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ status, percent }) => 
                      `${status} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {statistics.reservationsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalStatisticsTab;
