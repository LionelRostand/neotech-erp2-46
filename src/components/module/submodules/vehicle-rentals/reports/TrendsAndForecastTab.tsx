
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { PlaneTakeoff, Ship, Car, Clock, Calendar, ArrowUpRight } from "lucide-react";
import StatCard from '@/components/StatCard';

interface TrendsAndForecastTabProps {
  timeRange: string;
}

// Mock data for seasonal trends
const getSeasonalTrends = () => [
  { month: 'Jan', reservations: 120, actual: 118, forecast: 120 },
  { month: 'Fév', reservations: 140, actual: 142, forecast: 140 },
  { month: 'Mar', reservations: 180, actual: 176, forecast: 180 },
  { month: 'Avr', reservations: 220, actual: 214, forecast: 220 },
  { month: 'Mai', reservations: 260, actual: 258, forecast: 260 },
  { month: 'Juin', reservations: 320, actual: 324, forecast: 320 },
  { month: 'Juil', reservations: 380, actual: 386, forecast: 380 },
  { month: 'Août', reservations: 400, actual: 405, forecast: 400 },
  { month: 'Sep', reservations: 300, actual: 289, forecast: 300 },
  { month: 'Oct', reservations: 240, actual: 235, forecast: 240 },
  { month: 'Nov', reservations: 180, actual: 175, forecast: 180 },
  { month: 'Déc', reservations: 220, actual: 204, forecast: 220 },
];

// Mock data for revenue forecast
const getRevenueForecast = () => [
  { month: 'Jan', actual: 25800, forecast: 25800 },
  { month: 'Fév', actual: 28200, forecast: 28200 },
  { month: 'Mar', actual: 38400, forecast: 38400 },
  { month: 'Avr', actual: 42600, forecast: 42600 },
  { month: 'Mai', actual: 53800, forecast: 53800 },
  { month: 'Juin', actual: 68500, forecast: 68500 },
  { month: 'Juil', actual: 82600, forecast: 82600 },
  { month: 'Août', actual: 85200, forecast: 85200 },
  { month: 'Sep', actual: 65400, forecast: 64000 },
  { month: 'Oct', actual: 0, forecast: 52000 },
  { month: 'Nov', actual: 0, forecast: 38000 },
  { month: 'Déc', actual: 0, forecast: 46000 },
];

// Mock data for tourism impact
const getTourismImpact = () => [
  { name: 'Vacances scolaires', impact: 35 },
  { name: 'Festivals locaux', impact: 15 },
  { name: 'Tourisme d\'affaires', impact: 25 },
  { name: 'Événements sportifs', impact: 10 },
  { name: 'Tourisme saisonnier', impact: 15 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const TrendsAndForecastTab: React.FC<TrendsAndForecastTabProps> = ({ timeRange }) => {
  const seasonalTrends = getSeasonalTrends();
  const revenueForecast = getRevenueForecast();
  const tourismImpact = getTourismImpact();
  
  // Calculate year-to-date metrics
  const annualGrowthRate = 18; // Percentage
  const predictedYearTotal = revenueForecast.reduce((sum, item) => sum + item.forecast, 0);
  const peakSeason = "Juillet-Août";
  
  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances saisonnières</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Réservations actuelles" 
                    stroke="#4f46e5" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Prévisions" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prévisions de revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueForecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    name="Revenus actuels" 
                    stroke="#4f46e5"
                    fill="#4f46e530"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Prévisions" 
                    stroke="#f59e0b"
                    fill="#f59e0b30"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facteurs d'influence du tourisme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={tourismImpact}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value) => [`${value}%`, 'Impact sur les réservations']} />
                <Legend />
                <Bar dataKey="impact" name="Impact sur les réservations" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsAndForecastTab;
