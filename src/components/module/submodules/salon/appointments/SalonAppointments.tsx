
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppointmentsList from './components/AppointmentsList';
import AppointmentsCalendar from './components/AppointmentsCalendar';
import CreateAppointmentDialog from './components/CreateAppointmentDialog';
import { useAppointments } from './hooks/useAppointments';

const SalonAppointments = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { 
    appointments, 
    filteredAppointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointments(searchTerm);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Rendez-vous</h2>
        <Button 
          onClick={() => setOpenCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouveau Rendez-vous</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par client, coiffeur ou service..."
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
            <AppointmentsList 
              appointments={filteredAppointments} 
              isLoading={isLoading}
              onUpdate={updateAppointment}
              onDelete={deleteAppointment}
            />
          ) : (
            <AppointmentsCalendar 
              appointments={appointments}
              isLoading={isLoading}
              onUpdate={updateAppointment}
            />
          )}
        </CardContent>
      </Card>

      <CreateAppointmentDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        onCreateAppointment={createAppointment}
      />
    </div>
  );
};

export default SalonAppointments;
