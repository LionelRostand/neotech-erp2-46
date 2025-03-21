
import React from 'react';
import StatCard from "@/components/StatCard";
import { BarChart3, Users, Scissors, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SalonStats } from '../hooks/useSalonStats';

interface KeyStatsGridProps {
  stats: SalonStats;
}

const KeyStatsGrid: React.FC<KeyStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Revenus Mensuels" 
        value={`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.currentMonthRevenue)}`} 
        icon={<BarChart3 className="h-5 w-5 text-gray-500" />} 
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
        title="Clients" 
        value={stats.totalClients.toString()}
        icon={<Users className="h-5 w-5 text-gray-500" />} 
        description={`${stats.newClientsThisMonth} nouveaux ce mois-ci`}
      />
      
      <StatCard 
        title="Taux d'Occupation" 
        value={`${stats.occupancyRate}%`} 
        icon={<Scissors className="h-5 w-5 text-gray-500" />} 
        description={`${stats.busyStylists}/${stats.totalStylists} coiffeurs occupés`}
      />
      
      <StatCard 
        title="Rendez-vous" 
        value={stats.totalAppointmentsToday.toString()} 
        icon={<Calendar className="h-5 w-5 text-gray-500" />} 
        description={`${stats.completedAppointments} terminés, ${stats.totalAppointmentsWeek} cette semaine`}
      />
    </div>
  );
};

export default KeyStatsGrid;
