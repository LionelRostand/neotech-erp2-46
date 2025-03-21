
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservationsList from './reservations/ReservationsList';
import ReservationCalendar from './reservations/ReservationCalendar';
import CreateReservationDialog from './reservations/CreateReservationDialog';

const ReservationsManagement = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Réservations</h2>
        <Button 
          onClick={() => setOpenCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouvelle réservation</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Réservations</CardTitle>
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
            <ReservationsList />
          ) : (
            <ReservationCalendar />
          )}
        </CardContent>
      </Card>

      <CreateReservationDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog} 
      />
    </div>
  );
};

export default ReservationsManagement;
