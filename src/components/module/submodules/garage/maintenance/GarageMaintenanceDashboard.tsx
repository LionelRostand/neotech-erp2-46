
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Plus } from "lucide-react";
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

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { maintenances, vehicles, clients, mechanics, isLoading } = useGarageData();

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Maintenance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des maintenances</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Chargement...</div>
          ) : (
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
                        <Button variant="outline" size="sm">Voir</Button>
                        <Button variant="outline" size="sm">Modifier</Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddMaintenanceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
