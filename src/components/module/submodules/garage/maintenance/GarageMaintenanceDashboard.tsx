
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { formatDate } from '@/lib/utils';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { maintenances = [], isLoading } = useGarageData();

  const handleView = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setViewDialogOpen(true);
  };

  const handleEdit = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setEditDialogOpen(true);
  };

  const handleDelete = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setDeleteDialogOpen(true);
  };

  const handleMaintenanceChange = () => {
    // This will trigger a refetch of the maintenance data
    console.log("Maintenance changed, refetching data...");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Mécanicien</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Coût Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>{formatDate(maintenance.date)}</TableCell>
                <TableCell>{maintenance.vehicleId}</TableCell>
                <TableCell>{maintenance.clientId}</TableCell>
                <TableCell>{maintenance.mechanicId}</TableCell>
                <TableCell>{maintenance.status}</TableCell>
                <TableCell>{maintenance.totalCost}€</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(maintenance)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(maintenance)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(maintenance)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddMaintenanceDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />

      <ViewMaintenanceDialog
        maintenance={selectedMaintenance}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditMaintenanceDialog
        maintenance={selectedMaintenance}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleMaintenanceChange}
      />

      <DeleteMaintenanceDialog
        maintenanceId={selectedMaintenance?.id ?? null}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleMaintenanceChange}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
