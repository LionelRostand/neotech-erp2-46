
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TodaysAppointments } from './dashboard/TodaysAppointments';
import { UnpaidInvoices } from './dashboard/UnpaidInvoices';
import { LowStockItems } from './dashboard/LowStockItems';
import { RevenueChart } from './dashboard/RevenueChart';
import { VehicleStatusDonut } from './dashboard/VehicleStatusDonut';
import { Car, Wrench, SprayCan, Settings } from 'lucide-react';
import StatCard from '@/components/StatCard';

const GarageDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Véhicules en réparation"
          value="8"
          icon={<Car className="h-5 w-5 text-blue-500" />}
          description="3 en attente de pièces"
        />
        <StatCard
          title="Rendez-vous aujourd'hui"
          value="12"
          icon={<Wrench className="h-5 w-5 text-green-500" />}
          description="4 terminés"
        />
        <StatCard
          title="Stock à commander"
          value="15"
          icon={<SprayCan className="h-5 w-5 text-amber-500" />}
          description="Pièces sous seuil minimal"
        />
        <StatCard
          title="Maintenance prévue"
          value="3"
          icon={<Settings className="h-5 w-5 text-purple-500" />}
          description="Équipements à réviser"
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
