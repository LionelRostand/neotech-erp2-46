
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModuleContainer from '../../ModuleContainer';
import { ArrowUpCircle, AlertTriangle, Clock, Calendar } from 'lucide-react';

const TransportDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleContainer title="Aperçu des activités">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Réservations aujourd'hui"
            value="12"
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
            trend="+3"
          />
          <DashboardCard
            title="Véhicules actifs"
            value="8"
            icon={<ArrowUpCircle className="h-5 w-5 text-green-500" />}
            trend="-1"
            trendNegative
          />
          <DashboardCard
            title="Incidents en cours"
            value="2"
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            trend="0"
          />
          <DashboardCard
            title="Temps de réponse moyen"
            value="5 min"
            icon={<Clock className="h-5 w-5 text-purple-500" />}
            trend="-2 min"
            trendPositive
          />
        </div>
      </ModuleContainer>
      
      <ModuleContainer>
        <Tabs defaultValue="reservations">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="reservations" className="flex-1">Réservations</TabsTrigger>
            <TabsTrigger value="fleet" className="flex-1">Flotte</TabsTrigger>
            <TabsTrigger value="drivers" className="flex-1">Chauffeurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Aperçu des réservations</h3>
              <p className="text-sm text-gray-500">
                Consultez ici les données relatives aux réservations de transport.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="fleet">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Aperçu de la flotte</h3>
              <p className="text-sm text-gray-500">
                État et disponibilité de la flotte de véhicules.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="drivers">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Disponibilité des chauffeurs</h3>
              <p className="text-sm text-gray-500">
                Statut et disponibilité des chauffeurs.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </ModuleContainer>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendPositive?: boolean;
  trendNegative?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendPositive,
  trendNegative
}) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`text-xs ${trendPositive ? 'text-green-500' : trendNegative ? 'text-red-500' : 'text-gray-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default TransportDashboard;
