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

  const completedMaintenances = maintenances.filter(m => m.status === 'completed').length;
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in_progress').length;
  const scheduledMaintenances = maintenances.filter(m => m.status === 'scheduled').length;

  if (isLoading) return <div className="flex items-center justify-center h-96">Chargement...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
          Maintenances
        </h2>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-indigo-100 bg-indigo-50/50 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-indigo-900">
              Maintenances terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{completedMaintenances}</div>
          </CardContent>
        </Card>

        <Card className="border border-amber-100 bg-amber-50/50 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-amber-900">
              Maintenances en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{inProgressMaintenances}</div>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 bg-blue-50/50 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900">
              Maintenances planifiées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledMaintenances}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200/70">
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
