
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddMaintenanceDialog from './AddMaintenanceDialog';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Maintenance
        </Button>
      </div>

      <AddMaintenanceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
