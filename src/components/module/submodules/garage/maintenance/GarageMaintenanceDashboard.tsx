import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Plus, Wrench, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import StatCard from '@/components/StatCard';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { maintenances, vehicles, clients, mechanics, isLoading } = useGarageData();

  // Statistiques des maintenances
  const scheduledMaintenances = maintenances.filter(m => m.status === 'scheduled');
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in_progress');
  const completedMaintenances = maintenances.filter(m => m.status === 'completed');
  const urgentMaintenances = maintenances.filter(m => m.status === 'scheduled' && new Date(m.date) <= new Date());

  const handleView = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setShowViewDialog(true);
  };

  const handleEdit = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setShowEditDialog(true);
  };

  const handleDelete = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setShowDeleteDialog(true);
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule inconnu';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client inconnu';
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Mécanicien inconnu';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Section Tableau de bord */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Planifiées"
          value={scheduledMaintenances.length.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Maintenances à venir"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En cours"
          value={inProgressMaintenances.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Maintenances actives"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="Terminées"
          value={completedMaintenances.length.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Maintenances complétées"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="Urgentes"
          value={urgentMaintenances.length.toString()}
          icon={<AlertCircle className="h-4 w-4" />}
          description="Nécessitent attention"
          className="bg-red-50 hover:bg-red-100"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Liste des maintenances</h2>
        </div>
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Mécanicien</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>{getVehicleInfo(maintenance.vehicleId)}</TableCell>
                  <TableCell>{getClientName(maintenance.clientId)}</TableCell>
                  <TableCell>{getMechanicName(maintenance.mechanicId)}</TableCell>
                  <TableCell>
                    {maintenance.date ? format(new Date(maintenance.date), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {maintenance.status === 'scheduled' ? 'Planifiée' :
                     maintenance.status === 'in_progress' ? 'En cours' :
                     maintenance.status === 'completed' ? 'Terminée' :
                     maintenance.status === 'cancelled' ? 'Annulée' : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(maintenance)}>
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(maintenance)}>
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(maintenance)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddMaintenanceDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />

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
        maintenanceId={selectedMaintenance?.id}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
