
import React from 'react';
import { ArrowUpRight, Calendar, Clock, Car } from "lucide-react";
import StatCard from '@/components/StatCard';

interface StatCardsProps {
  annualGrowthRate: number;
  predictedYearTotal: number;
  peakSeason: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const StatCards: React.FC<StatCardsProps> = ({ 
  annualGrowthRate, 
  predictedYearTotal, 
  peakSeason 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Croissance annuelle"
        value={`+${annualGrowthRate}%`}
        icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
        description="Vs année précédente"
      />
      <StatCard
        title="Prévision annuelle"
        value={formatCurrency(predictedYearTotal)}
        icon={<Calendar className="h-5 w-5 text-blue-500" />}
        description="Revenus totaux"
      />
      <StatCard
        title="Haute saison"
        value={peakSeason}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        description="Période la plus rentable"
      />
      <StatCard
        title="Précision prévisions"
        value="96.8%"
        icon={<Car className="h-5 w-5 text-purple-500" />}
        description="Sur les 6 derniers mois"
      />
    </div>
  );
};

export default StatCards;
