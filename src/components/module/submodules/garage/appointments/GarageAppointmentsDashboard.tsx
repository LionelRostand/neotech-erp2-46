
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateAppointmentDialog from './CreateAppointmentDialog';

const GarageAppointmentsDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateAppointment = async (data: any) => {
    console.log('Creating new appointment:', data);
    // TODO: Implement appointment creation
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Rendez-vous</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau Rendez-vous</span>
        </Button>
      </div>

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAppointment}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
