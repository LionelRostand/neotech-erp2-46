
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Euro, Clock, TrendingUp } from 'lucide-react';
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

  // Calculate statistics
  const totalMaintenances = maintenances.length;
  const averageCost = maintenances.length > 0 
    ? maintenances.reduce((acc, m) => acc + (m.cost || 0), 0) / maintenances.length 
    : 0;
  const averageDuration = maintenances.length > 0
    ? maintenances.reduce((acc, m) => acc + (m.duration || 0), 0) / maintenances.length
    : 0;
  const activeMaintenances = maintenances.filter(m => m.status === 'active').length;

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Services
        </h2>
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">{totalMaintenances}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Coût Moyen</CardTitle>
            <Euro className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{averageCost.toFixed(2)}€</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{averageDuration.toFixed(0)} min</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Services Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{activeMaintenances}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Derniers services</CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenancesTable 
            maintenances={maintenances} 
            onView={(maintenance) => {
              setSelectedMaintenance(maintenance);
              setViewDialogOpen(true);
            }}
            onEdit={(maintenance) => {
              setSelectedMaintenance(maintenance);
              setEditDialogOpen(true);
            }}
            onDelete={(maintenance) => {
              setSelectedMaintenance(maintenance);
              setDeleteDialogOpen(true);
            }}
          />
        </CardContent>
      </Card>

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

      <AddMaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onMaintenanceAdded={refetch}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
