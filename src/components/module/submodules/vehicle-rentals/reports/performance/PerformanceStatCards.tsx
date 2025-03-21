
import React from 'react';
import { CarFront, Wrench, RotateCw, Fuel } from "lucide-react";
import StatCard from '@/components/StatCard';

interface PerformanceStatCardsProps {
  avgUtilizationRate: number;
  maintenanceEvents: number;
  avgSatisfaction: number;
}

const PerformanceStatCards: React.FC<PerformanceStatCardsProps> = ({
  avgUtilizationRate,
  maintenanceEvents,
  avgSatisfaction
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Taux d'utilisation"
        value={`${avgUtilizationRate}%`}
        icon={<RotateCw className="h-5 w-5 text-blue-500" />}
        description="Moyenne de la flotte"
      />
      <StatCard
        title="Maintenance"
        value={`${maintenanceEvents}`}
        icon={<Wrench className="h-5 w-5 text-amber-500" />}
        description="Interventions totales"
      />
      <StatCard
        title="Satisfaction"
        value={`${avgSatisfaction}/5`}
        icon={<CarFront className="h-5 w-5 text-green-500" />}
        description="Note moyenne"
      />
      <StatCard
        title="Consommation"
        value="6.8 L/100km"
        icon={<Fuel className="h-5 w-5 text-red-500" />}
        description="Moyenne de la flotte"
      />
    </div>
  );
};

export default PerformanceStatCards;
