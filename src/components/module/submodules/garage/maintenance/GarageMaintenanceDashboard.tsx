
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import MaintenanceTable from './MaintenanceTable';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { GarageMaintenance } from '@/types/module-types';

const GarageMaintenanceDashboard = () => {
  const { maintenances = [], isLoading, refetch } = useGarageData();
  const [selectedMaintenance, setSelectedMaintenance] = useState<GarageMaintenance | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = (maintenance: GarageMaintenance) => {
    setSelectedMaintenance(maintenance);
    setShowViewDialog(true);
  };

  const handleEdit = (maintenance: GarageMaintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditDialog(true);
  };

  const handleDelete = (maintenance: GarageMaintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <MaintenanceTable 
        maintenances={maintenances}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddMaintenanceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={refetch}
      />

      {selectedMaintenance && (
        <>
          <ViewMaintenanceDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            maintenance={selectedMaintenance}
          />

          <EditMaintenanceDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            maintenance={selectedMaintenance}
          />

          <DeleteMaintenanceDialog 
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            maintenanceId={selectedMaintenance.id}
          />
        </>
      )}
    </div>
  );
};

export default GarageMaintenanceDashboard;
