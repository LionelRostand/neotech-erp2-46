
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Car, Users, CalendarCheck, AlertTriangle, TrendingUp, 
  Wrench, CreditCard, Package, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GarageStats } from './types/garage-types';
import { RevenueChart } from './dashboard/RevenueChart';
import { TodaysAppointments } from './dashboard/TodaysAppointments';
import { UnpaidInvoices } from './dashboard/UnpaidInvoices';
import { LowStockItems } from './dashboard/LowStockItems';
import { VehicleStatusDonut } from './dashboard/VehicleStatusDonut';

const GarageDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<GarageStats>({
    totalRepairs: 28,
    ongoingRepairs: 12,
    completedRepairs: 16,
    totalVehicles: 45,
    monthlyRevenue: 32450,
    previousMonthRevenue: 29700,
    revenueChange: 9.3,
    retentionRate: 78,
    todaysAppointments: 8,
    unpaidInvoices: 5,
    lowStockItems: 7,
    customerCount: 124,
    newCustomersThisMonth: 14
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

      {/* Alerts */}
      {(stats.unpaidInvoices > 0 || stats.lowStockItems > 0) && (
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention requise</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            {stats.unpaidInvoices > 0 && (
              <span>{stats.unpaidInvoices} factures sont en attente de paiement</span>
            )}
            {stats.lowStockItems > 0 && (
              <span>{stats.lowStockItems} articles sont en rupture de stock</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Réparations en cours
            </CardTitle>
            <Wrench className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.ongoingRepairs}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalRepairs} réparations au total ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Taux de fidélisation
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.retentionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.newCustomersThisMonth} nouveaux clients ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Revenus mensuels
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.monthlyRevenue)}
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
              Rendez-vous aujourd'hui
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todaysAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalVehicles} véhicules enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chiffre d'affaires</CardTitle>
            <CardDescription>
              Évolution des revenus sur les 12 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Donut chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des réparations</CardTitle>
            <CardDescription>
              Répartition par état actuel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <VehicleStatusDonut 
              ongoing={stats.ongoingRepairs}
              completed={stats.completedRepairs}
              totalVehicles={stats.totalVehicles}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's appointments */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                <span>Rendez-vous du jour</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodaysAppointments />
          </CardContent>
        </Card>

        {/* Unpaid invoices */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Factures impayées</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnpaidInvoices />
          </CardContent>
        </Card>

        {/* Low stock items */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Stock critique</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LowStockItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GarageDashboard;
