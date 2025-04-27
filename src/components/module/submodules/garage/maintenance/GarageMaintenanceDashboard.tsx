
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { useGarageData } from '@/hooks/garage/useGarageData';

const GarageMaintenanceDashboard = () => {
  const { maintenances, isLoading, refetch } = useGarageData();
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Liste des maintenances</h1>
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Maintenance
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => (
            <TableRow key={maintenance.id}>
              <TableCell>{maintenance.date}</TableCell>
              <TableCell>{maintenance.clientId}</TableCell>
              <TableCell>{maintenance.vehicleId}</TableCell>
              <TableCell>{maintenance.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedMaintenance(maintenance);
                      setViewDialogOpen(true);
                    }}
                  >
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedMaintenance(maintenance);
                      setEditDialogOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      setSelectedMaintenance(maintenance);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddMaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onMaintenanceAdded={refetch}
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
