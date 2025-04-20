
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from './DashboardTab';
import { BarChart3, LineChart, PieChart } from "lucide-react";

const ReportsManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Rapports</h2>
        <p className="text-muted-foreground">Analyse des données de location</p>
      </div>
      
      <Card>
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Revenus
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Véhicules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="revenue">
            <div className="p-4">
              <p>Analyse des revenus à venir...</p>
            </div>
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="p-4">
              <p>Analyse des véhicules à venir...</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportsManagement;
