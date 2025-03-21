
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, CarFront, Clock } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import StatCard from '@/components/StatCard';

interface RentalStatisticsTabProps {
  timeRange: string;
}

// Mock data for rental statistics
const getMockRentalStatsByDay = () => [
  { name: 'Lun', reservations: 4 },
  { name: 'Mar', reservations: 6 },
  { name: 'Mer', reservations: 8 },
  { name: 'Jeu', reservations: 10 },
  { name: 'Ven', reservations: 12 },
  { name: 'Sam', reservations: 15 },
  { name: 'Dim', reservations: 9 },
];

// Mock data for rental statistics by category
const getMockRentalStatsByCategory = () => [
  { name: 'Compactes', reservations: 24 },
  { name: 'Berlines', reservations: 18 },
  { name: 'SUV', reservations: 32 },
  { name: 'Premium', reservations: 15 },
  { name: 'Utilitaires', reservations: 12 },
];

const RentalStatisticsTab: React.FC<RentalStatisticsTabProps> = ({ timeRange }) => {
  const dailyData = getMockRentalStatsByDay();
  const categoryData = getMockRentalStatsByCategory();
  
  // Summary statistics for the cards
  const totalReservations = dailyData.reduce((sum, item) => sum + item.reservations, 0);
  const avgDurationDays = 4.5; // Mock average duration
  const uniqueCustomers = 38; // Mock unique customers
  const cancellationRate = "8%"; // Mock cancellation rate
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Réservations"
          value={`${totalReservations}`}
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          description="Réservations totales"
        />
        <StatCard
          title="Durée moyenne"
          value={`${avgDurationDays} jours`}
          icon={<Clock className="h-5 w-5 text-green-500" />}
          description="Par réservation"
        />
        <StatCard
          title="Clients uniques"
          value={`${uniqueCustomers}`}
          icon={<User className="h-5 w-5 text-purple-500" />}
          description="Sur la période"
        />
        <StatCard
          title="Taux d'annulation"
          value={cancellationRate}
          icon={<CarFront className="h-5 w-5 text-red-500" />}
          description="Des réservations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Réservations par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} réservations`, 'Réservations']}
                    labelFormatter={(label) => `Jour: ${label}`}
                  />
                  <Bar dataKey="reservations" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations par catégorie de véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} réservations`, 'Réservations']}
                    labelFormatter={(label) => `Catégorie: ${label}`}
                  />
                  <Bar dataKey="reservations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalStatisticsTab;
