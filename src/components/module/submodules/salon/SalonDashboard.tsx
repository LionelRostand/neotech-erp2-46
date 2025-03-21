
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonStats } from './hooks/useSalonStats';
import KeyStatsGrid from './components/KeyStatsGrid';
import UpcomingAppointments from './components/UpcomingAppointments';
import SalonAlerts from './components/SalonAlerts';
import RevenueChart from './components/RevenueChart';
import StylistsStatus from './components/StylistsStatus';
import TopServices from './components/TopServices';

const SalonDashboard: React.FC = () => {
  const { 
    stats, 
    alerts, 
    todayAppointments, 
    upcomingAppointments,
    revenueData,
    isLoading, 
    error 
  } = useSalonStats();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <Card>
      <CardContent className="pt-6">
        <div className="text-red-500">
          Une erreur est survenue lors du chargement des données : {error.message}
        </div>
      </CardContent>
    </Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <SalonAlerts 
          newAppointments={alerts.newAppointments} 
          pendingPayments={alerts.pendingPayments} 
          lowStockProducts={alerts.lowStockProducts} 
        />
      </div>

      <KeyStatsGrid stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueChart revenueData={revenueData} />
        <UpcomingAppointments 
          todayAppointments={todayAppointments} 
          upcomingAppointments={upcomingAppointments} 
        />
        <StylistsStatus 
          availableStylists={stats.availableStylists} 
          busyStylists={stats.busyStylists} 
          offStylists={stats.offStylists} 
          totalStylists={stats.totalStylists} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopServices />
      </div>
    </div>
  );
};

export default SalonDashboard;
