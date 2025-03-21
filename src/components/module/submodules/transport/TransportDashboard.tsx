
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Car, CalendarCheck, AlertTriangle, TrendingUp, Users, 
  Map, CreditCard, ArrowUpRight, ArrowDownRight, 
  BarChart3, Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const TransportDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("day");

  // Sample data for the dashboard
  const stats = {
    totalVehicles: 48,
    availableVehicles: 32,
    inUseVehicles: 14,
    maintenanceVehicles: 2,
    totalDrivers: 26,
    activeDrivers: 21,
    occupancyRate: 67,
    currentMonthRevenue: 32450,
    previousMonthRevenue: 29800,
    revenueChange: 8.9,
    pendingPayments: 3,
    todayReservations: 8,
    upcomingReservations: 14
  };

  // Sample data for the revenue chart
  const revenueData = [
    { day: '01', revenue: 1200 },
    { day: '02', revenue: 1400 },
    { day: '03', revenue: 1300 },
    { day: '04', revenue: 1500 },
    { day: '05', revenue: 1350 },
    { day: '06', revenue: 1700 },
    { day: '07', revenue: 1850 },
    { day: '08', revenue: 2000 },
    { day: '09', revenue: 1900 },
    { day: '10', revenue: 2200 },
    { day: '11', revenue: 2100 },
    { day: '12', revenue: 2300 },
    { day: '13', revenue: 2400 },
    { day: '14', revenue: 2600 },
  ];

  // Sample data for recent reservations
  const recentReservations = [
    { id: "123", date: "2023-07-15", client: "Jean Dupont", service: "Transfert aéroport", status: "success", statusText: "Confirmée" },
    { id: "124", date: "2023-07-15", client: "Marie Legrand", service: "Location journée", status: "warning", statusText: "En attente" },
    { id: "125", date: "2023-07-16", client: "Paul Martin", service: "Transfert gare", status: "success", statusText: "Confirmée" },
    { id: "126", date: "2023-07-17", client: "Sophie Bernard", service: "Location weekend", status: "danger", statusText: "Annulée" },
    { id: "127", date: "2023-07-18", client: "Thomas Petit", service: "Chauffeur journée", status: "success", statusText: "Confirmée" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Transport - Tableau de bord</h2>
        <div className="flex space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Alerts */}
      <Alert className="border-orange-300 bg-orange-50 text-orange-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Alertes</AlertTitle>
        <AlertDescription className="flex flex-col gap-1">
          <span>{stats.maintenanceVehicles} véhicules en maintenance</span>
          <span>{stats.pendingPayments} paiements en attente</span>
          <span>{stats.todayReservations} réservations aujourd'hui</span>
        </AlertDescription>
      </Alert>

      {/* Key stats */}
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
            <span className={`flex items-center ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.revenueChange)}% vs mois précédent
            </span>
          }
        />
        
        <StatCard 
          title="Chauffeurs Actifs" 
          value={`${stats.activeDrivers}/${stats.totalDrivers}`} 
          icon={<Users className="h-5 w-5 text-gray-500" />} 
          description={`${Math.round(100 * stats.activeDrivers / stats.totalDrivers)}% de disponibilité`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenus Transport</CardTitle>
            <CardDescription>
              Évolution des revenus des 14 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 shadow-md rounded-md border">
                            <p className="font-semibold">{`Jour ${payload[0].payload.day}`}</p>
                            <p className="text-blue-600">{`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming reservations */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                <span>Réservations à venir</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayReservations}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">À venir</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.upcomingReservations}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>Prochaine: <span className="font-medium text-gray-700">15:30 - Transfert Aéroport</span></p>
                <p>Client: <span className="font-medium text-gray-700">Jean Dupont</span></p>
                <p>Chauffeur: <span className="font-medium text-gray-700">Marc Leblanc</span></p>
              </div>
              <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
                Voir toutes les réservations
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reservations */}
        <DataTable
          title="Réservations récentes"
          data={recentReservations}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'date', header: 'Date' },
            { key: 'client', header: 'Client' },
            { key: 'service', header: 'Service' },
            { 
              key: 'status', 
              header: 'Statut',
              cell: ({ row }) => {
                const { status, statusText } = row.original;
                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${status === 'success' ? 'bg-green-100 text-green-800' : ''}
                    ${status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${status === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {statusText}
                  </span>
                );
              }
            }
          ]}
          onRowClick={(row) => toast({
            title: "Détails de la réservation",
            description: `ID: ${row.id} - Client: ${row.client}`
          })}
        />

        {/* Vehicles status */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                <span>Statut des véhicules</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{stats.availableVehicles}</p>
                    </div>
                    <Car className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">En service</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.inUseVehicles}</p>
                    </div>
                    <Car className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Maintenance</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.maintenanceVehicles}</p>
                    </div>
                    <Car className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalVehicles}</p>
                    </div>
                    <Car className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
              <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
                Gérer la flotte
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransportDashboard;
