
import React from 'react';
import StatCard from "@/components/StatCard";
import { Car, BarChart3, CreditCard, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KeyStatsGridProps {
  stats: {
    totalVehicles: number;
    availableVehicles: number;
    inUseVehicles: number;
    occupancyRate: number;
    currentMonthRevenue: number;
    previousMonthRevenue: number;
    revenueChange: number;
    totalDrivers: number;
    activeDrivers: number;
  };
}

const KeyStatsGrid: React.FC<KeyStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Véhicules Disponibles" 
        value={`${stats.availableVehicles}/${stats.totalVehicles}`} 
        icon={<Car className="h-5 w-5 text-gray-500" />} 
        description={`${Math.round(100 * stats.availableVehicles / stats.totalVehicles)}% de la flotte disponible`}
      />
      
      <StatCard 
        title="Taux d'Occupation" 
        value={`${stats.occupancyRate}%`} 
        icon={<BarChart3 className="h-5 w-5 text-gray-500" />} 
        description={`${stats.inUseVehicles} véhicules actuellement en service`}
      />
      
      <StatCard 
        title="Revenus Mensuels" 
        value={`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.currentMonthRevenue)}`} 
        icon={<CreditCard className="h-5 w-5 text-gray-500" />} 
        description={
          <div className={`flex items-center ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.revenueChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {Math.abs(stats.revenueChange)}% vs mois précédent
          </div>
        }
      />
      
      <StatCard 
        title="Chauffeurs Actifs" 
        value={`${stats.activeDrivers}/${stats.totalDrivers}`} 
        icon={<Users className="h-5 w-5 text-gray-500" />} 
        description={`${Math.round(100 * stats.activeDrivers / stats.totalDrivers)}% de disponibilité`}
      />
    </div>
  );
};

export default KeyStatsGrid;
