
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import DriversHeader from './components/drivers/DriversHeader';
import DriversTable from './components/drivers/DriversTable';
import DriverPerformance from './components/drivers/DriverPerformance';
import DriverAvailability from './components/drivers/DriverAvailability';

const TransportDrivers = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <DriversHeader />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un chauffeur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouveau chauffeur</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des chauffeurs</CardTitle>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="availability">Disponibilité</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="list" className="mt-0">
            <DriversTable searchTerm={searchTerm} />
          </TabsContent>
          <TabsContent value="performance" className="mt-0">
            <DriverPerformance />
          </TabsContent>
          <TabsContent value="availability" className="mt-0">
            <DriverAvailability />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportDrivers;
