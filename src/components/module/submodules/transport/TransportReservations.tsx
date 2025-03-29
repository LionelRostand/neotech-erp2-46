
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservationsCalendar from './reservations/ReservationsCalendar';
import ReservationsList from './reservations/ReservationsList';
import CreateReservationDialog from './reservations/CreateReservationDialog';

const TransportReservations: React.FC = () => {
  const [viewMode, setViewMode] = useState('list');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservations de Transport</h2>
        <Button className="flex items-center gap-2" onClick={() => setCreateDialogOpen(true)}>
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
              onValueChange={setViewMode}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List size={16} />
                  <span>Liste</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon size={16} />
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
            <ReservationsCalendar />
          )}
        </CardContent>
      </Card>

      <CreateReservationDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default TransportReservations;
