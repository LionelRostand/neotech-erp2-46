
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Car, Users, CalendarCheck, AlertTriangle, TrendingUp, 
  Wrench, CreditCard, Map, ArrowUpRight, ArrowDownRight, 
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RentalStats } from './types/rental-types';
import { RevenueChart } from './dashboard/RevenueChart';
import { MaintenanceAlerts } from './dashboard/MaintenanceAlerts';
import { RecentReservations } from './dashboard/RecentReservations';
import { VehicleStatusDonut } from './dashboard/VehicleStatusDonut';

const RentalsDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<RentalStats>({
    totalVehicles: 35,
    availableVehicles: 18,
    rentedVehicles: 12,
    inMaintenanceVehicles: 3,
    reservedVehicles: 2,
    inactiveVehicles: 0,
    currentMonthRevenue: 28450,
    previousMonthRevenue: 24800,
    revenueChange: 14.7,
    occupancyRate: 72,
    upcomingMaintenances: 4,
    overdueInvoices: 2,
    pendingReservations: 5
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tableau de bord</h2>
        <div className="flex space-x-2">
          <Tabs defaultValue="day" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Alertes */}
      {(stats.upcomingMaintenances > 0 || stats.overdueInvoices > 0 || stats.pendingReservations > 0) && (
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention requise</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            {stats.upcomingMaintenances > 0 && (
              <span>{stats.upcomingMaintenances} véhicules nécessitent un entretien planifié</span>
            )}
            {stats.overdueInvoices > 0 && (
              <span>{stats.overdueInvoices} factures sont en retard de paiement</span>
            )}
            {stats.pendingReservations > 0 && (
              <span>{stats.pendingReservations} réservations sont en attente de confirmation</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Véhicules Disponibles
            </CardTitle>
            <Car className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availableVehicles}/{stats.totalVehicles}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(100 * stats.availableVehicles / stats.totalVehicles)}% de la flotte disponible
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Taux d'Occupation
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.occupancyRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.rentedVehicles} véhicules actuellement loués
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Revenus Mensuels
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.currentMonthRevenue)}
            </div>
            <p className={`text-xs flex items-center ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.revenueChange)}% vs mois précédent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Entretiens Planifiés
            </CardTitle>
            <Wrench className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingMaintenances}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.inMaintenanceVehicles} actuellement en maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenus des Locations</CardTitle>
            <CardDescription>
              Évolution des revenus des 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Donut chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des Véhicules</CardTitle>
            <CardDescription>
              Répartition par état actuel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <VehicleStatusDonut 
              available={stats.availableVehicles}
              rented={stats.rentedVehicles}
              maintenance={stats.inMaintenanceVehicles}
              reserved={stats.reservedVehicles}
              inactive={stats.inactiveVehicles}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                <span>Alertes d'Entretien</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceAlerts />
          </CardContent>
        </Card>

        {/* Réservations récentes */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                <span>Réservations Récentes</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentReservations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalsDashboard;
