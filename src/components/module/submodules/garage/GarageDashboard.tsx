
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { Car, Calendar, Wrench, Receipt } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import RevenueChart from './dashboard/RevenueChart';
import VehicleStatusDonut from './dashboard/VehicleStatusDonut';
import TodaysAppointments from './dashboard/TodaysAppointments';
import UnpaidInvoices from './dashboard/UnpaidInvoices';
import LowStockItems from './dashboard/LowStockItems';

const GarageDashboard = () => {
  const { 
    vehicles, 
    appointments, 
    repairs, 
    clients,
    isLoading 
  } = useGarageData();

  const activeRepairs = repairs.filter(r => r.status === 'in_progress').length;
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  }).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord Garage</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Véhicules"
          value={vehicles.length.toString()}
          icon={<Car className="h-5 w-5 text-blue-500" />}
          description="Total des véhicules"
        />
        <StatCard
          title="Rendez-vous aujourd'hui"
          value={todayAppointments.toString()}
          icon={<Calendar className="h-5 w-5 text-green-500" />}
          description="Pour aujourd'hui"
        />
        <StatCard
          title="Réparations en cours"
          value={activeRepairs.toString()}
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          description="En atelier"
        />
        <StatCard
          title="Clients"
          value={clients.length.toString()}
          icon={<Receipt className="h-5 w-5 text-purple-500" />}
          description="Total clients"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Chiffre d'affaires mensuel</h2>
            <RevenueChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">État des véhicules</h2>
            <div className="h-[300px]">
              <VehicleStatusDonut 
                ongoing={8} 
                completed={15} 
                totalVehicles={30}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Rendez-vous du jour</h2>
            <TodaysAppointments />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Factures impayées</h2>
            <UnpaidInvoices />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Stock faible</h2>
            <LowStockItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GarageDashboard;
