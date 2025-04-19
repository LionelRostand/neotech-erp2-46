
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, CheckCircle } from "lucide-react";
import StatCard from '@/components/StatCard';
import CreateAppointmentDialog from './CreateAppointmentDialog';

const GarageAppointmentsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Rendez-vous"
          value="24"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          description="Cette semaine"
        />
        <StatCard
          title="Rendez-vous Aujourd'hui"
          value="8"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="3 en cours"
        />
        <StatCard
          title="Terminés"
          value="16"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Cette semaine"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prochains Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Aucun rendez-vous à venir</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Aucun rendez-vous récent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateAppointmentDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        clientId="1"
        clientName="Jean Dupont"
        onAppointmentCreated={() => {
          setShowAddDialog(false);
          // TODO: Refresh appointments list
        }}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
