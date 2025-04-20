
import React from 'react';
import StatCard from '@/components/StatCard';
import { Car, LineChart, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RentalsDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord des locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules disponibles"
          value="12"
          icon={<Car className="text-primary" size={20} />}
          description="+2 depuis hier"
        />
        <StatCard
          title="Revenus du mois"
          value="€8,540"
          icon={<LineChart className="text-primary" size={20} />}
          description="+15% ce mois"
        />
        <StatCard
          title="Clients actifs"
          value="45"
          icon={<Users className="text-primary" size={20} />}
          description="3 nouveaux aujourd'hui"
        />
        <StatCard
          title="Réservations"
          value="28"
          icon={<Calendar className="text-primary" size={20} />}
          description="5 en attente"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Locations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Visualisation des locations récentes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État de la flotte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Vue d'ensemble de l'état des véhicules
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalsDashboard;
