
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import MaintenancesTable from './MaintenancesTable';
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { Maintenance } from './types';

const GarageMaintenanceDashboard = () => {
  const { maintenances, isLoading, refetch } = useGarageData();
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleView = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setViewDialogOpen(true);
  };

  const handleEdit = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setEditDialogOpen(true);
  };

  const handleDelete = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setDeleteDialogOpen(true);
  };

  const handleMaintenanceAdded = () => {
    console.log("Maintenance ajoutée, rechargement des données...");
    refetch();
  };

  // Calculate maintenance stats
  const completedMaintenances = maintenances.filter(m => m.status === 'completed').length;
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in_progress').length;
  const scheduledMaintenances = maintenances.filter(m => m.status === 'scheduled').length;

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Maintenances</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Maintenances terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Maintenances en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Maintenances planifiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledMaintenances}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des maintenances</CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenancesTable 
            maintenances={maintenances} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <AddMaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onMaintenanceAdded={handleMaintenanceAdded}
      />

      {selectedMaintenance && (
        <>
          <ViewMaintenanceDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            maintenance={selectedMaintenance}
          />
          <EditMaintenanceDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            maintenance={selectedMaintenance}
            onMaintenanceUpdated={refetch}
          />
          <DeleteMaintenanceDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            maintenanceId={selectedMaintenance.id}
            onMaintenanceDeleted={refetch}
          />
        </>
      )}
    </div>
  );
};

export default GarageMaintenanceDashboard;
