
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import AddAppointmentDialog from './AddAppointmentDialog';

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

      <Card>
        <CardContent>
          <DataTable
            columns={[]}
            data={[]}
          />
        </CardContent>
      </Card>

      <AddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
