
import React, { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import DashboardHeader from './components/DashboardHeader';
import TransportAlerts from './components/TransportAlerts';
import KeyStatsGrid from './components/KeyStatsGrid';
import RevenueChart from './components/RevenueChart';
import UpcomingReservations from './components/UpcomingReservations';
import RecentReservations from './components/RecentReservations';
import VehiclesStatus from './components/VehiclesStatus';
import { useTransportStats } from './hooks/useTransportStats';

const TransportDashboard = () => {
  const [activeTab, setActiveTab] = useState("day");
  const { stats, revenueData, recentReservations } = useTransportStats(activeTab);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Transport - Tableau de bord" 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Alerts */}
      <TransportAlerts 
        maintenanceVehicles={stats.maintenanceVehicles}
        pendingPayments={stats.pendingPayments}
        todayReservations={stats.todayReservations}
      />

      {/* Key stats */}
      <KeyStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <RevenueChart revenueData={revenueData} />

        {/* Upcoming reservations */}
        <UpcomingReservations 
          todayReservations={stats.todayReservations}
          upcomingReservations={stats.upcomingReservations}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reservations */}
        <RecentReservations reservations={recentReservations} />

        {/* Vehicles status */}
        <VehiclesStatus 
          availableVehicles={stats.availableVehicles}
          inUseVehicles={stats.inUseVehicles}
          maintenanceVehicles={stats.maintenanceVehicles}
          totalVehicles={stats.totalVehicles}
        />
      </div>
    </div>
  );
};

export default TransportDashboard;
