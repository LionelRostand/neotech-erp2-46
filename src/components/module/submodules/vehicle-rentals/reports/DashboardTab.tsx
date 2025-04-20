
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from '@/components/ui/line-chart';
import { useReportsDashboard } from '@/hooks/vehicle-rentals/useReportsDashboard';
import StatCard from '@/components/StatCard';
import { Car, CalendarCheck, DollarSign, Clock } from "lucide-react";

const DashboardTab = () => {
  const { statistics, chartData, isLoading } = useReportsDashboard();

  if (isLoading) {
    return <div>Chargement...</div>;
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
            <LineChart
              data={chartData}
              xKey="month"
              yKey="rentals"
              color="#4f46e5"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
