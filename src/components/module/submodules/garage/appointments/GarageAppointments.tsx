
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppointmentsTable from './AppointmentsTable';
import AppointmentsCalendar from './AppointmentsCalendar';
import NewAppointmentDialog from './NewAppointmentDialog';
import { useGarageAppointments } from '../hooks/useGarageAppointments';

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Rendez-vous</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par client, véhicule ou mécanicien..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Rendez-vous</CardTitle>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List size={16} />
                  <span>Liste</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  <span>Calendrier</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <AppointmentsTable 
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
