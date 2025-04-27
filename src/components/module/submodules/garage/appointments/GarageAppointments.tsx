
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppointmentsList from './AppointmentsTable';
import AppointmentsCalendar from './AppointmentsCalendar';
import NewAppointmentDialog from './NewAppointmentDialog';
import { useGarageAppointments } from '../hooks/useGarageAppointments';
import AppointmentsStats from './components/AppointmentsStats';

const GarageAppointments = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { 
    appointments, 
    filteredAppointments,
    clients,
    vehicles,
    mechanics,
    services,
    isLoading,
    error,
    getClientName,
    getVehicleInfo,
    getMechanicName,
    getServiceName,
    refetch
  } = useGarageAppointments(searchTerm);

  return (
    <div className="p-6 space-y-6 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Rendez-vous
        </h2>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <AppointmentsStats appointments={appointments} />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par client, véhicule ou mécanicien..."
            className="pl-8 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0 border-gray-200 hover:bg-gray-100">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-800">Rendez-vous</CardTitle>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="list" 
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <List size={16} />
                  <span>Liste</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <CalendarCheck size={16} />
                  <span>Calendrier</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <AppointmentsList 
              appointments={filteredAppointments} 
              isLoading={isLoading}
              getClientName={getClientName}
              getVehicleInfo={getVehicleInfo}
              getMechanicName={getMechanicName}
              getServiceName={getServiceName}
              onRefresh={refetch}
            />
          ) : (
            <AppointmentsCalendar 
              appointments={appointments}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      <NewAppointmentDialog 
        isOpen={showAddDialog} 
        onClose={() => setShowAddDialog(false)}
        clients={clients}
        vehicles={vehicles}
        mechanics={mechanics}
        services={services}
        onSuccess={refetch}
      />
    </div>
  );
};

export default GarageAppointments;
