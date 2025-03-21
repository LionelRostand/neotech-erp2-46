
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

import SalesPerformanceTab from './components/SalesPerformanceTab';
import AppointmentsClientsTab from './components/AppointmentsClientsTab';
import ProductSalesTab from './components/ProductSalesTab';

const SalonReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("sales");

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting data in ${format} format`);
    // In a real app, this would call a service to export data
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold">Statistiques du Salon</h2>
          <p className="text-muted-foreground">Analysez les performances et générez des rapports</p>
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
          <TabsTrigger value="sales">
            Analyse des Performances
          </TabsTrigger>
          <TabsTrigger value="appointments">
            Rendez-vous & Clients
          </TabsTrigger>
          <TabsTrigger value="products">
            Ventes de Produits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesPerformanceTab timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsClientsTab timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="products">
          <ProductSalesTab timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonReports;
