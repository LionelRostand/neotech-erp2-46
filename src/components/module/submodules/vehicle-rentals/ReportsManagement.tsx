
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, LineChart, PieChart } from "lucide-react";
import DashboardTab from './reports/DashboardTab';
import RentalStatisticsTab from './reports/RentalStatisticsTab';
import RevenueAnalysisTab from './reports/RevenueAnalysisTab';
import VehiclePerformanceTab from './reports/VehiclePerformanceTab';
import TrendsAndForecastTab from './reports/TrendsAndForecastTab';

const ReportsManagement = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting data in ${format} format`);
    // Export implementation would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold">Rapports</h2>
          <p className="text-muted-foreground">Analysez vos données de location et générez des rapports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('excel')} className="gap-2">
              <FileDown className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques de locations
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <LineChart className="h-4 w-4" />
            Analyse des revenus
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <PieChart className="h-4 w-4" />
            Performance des véhicules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="statistics">
          <RentalStatisticsTab timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalysisTab timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="performance">
          <VehiclePerformanceTab timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
