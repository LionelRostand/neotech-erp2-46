
import React, { useState } from 'react';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddVehicleDialog from './AddVehicleDialog';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import { Vehicle } from '../types/garage-types';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { vehicles, loading, updateVehicle, deleteVehicle, refetchVehicles } = useGarageVehicles();

  const handleVehicleAdded = async () => {
    await refetchVehicles();
    setShowAddDialog(false);
  };

  const handleUpdateVehicle = async (vehicleId: string, data: Partial<Vehicle>) => {
    await updateVehicle(vehicleId, data);
    await refetchVehicles();
  };

  const handleDeleteVehicle = async () => {
    if (selectedVehicle) {
      await deleteVehicle(selectedVehicle.id, selectedVehicle.clientId);
      setShowDeleteDialog(false);
      setSelectedVehicle(null);
      await refetchVehicles();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Véhicules</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau véhicule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>En Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v?.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v?.status === 'available').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Kilométrage</TableHead>
                <TableHead>Dernier contrôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucun véhicule trouvé. Cliquez sur "Nouveau véhicule" pour en ajouter.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle?.id}>
                    <TableCell>
                      {vehicle?.make} {vehicle?.model} ({vehicle?.year})
                    </TableCell>
                    <TableCell>{vehicle?.licensePlate}</TableCell>
                    <TableCell>{vehicle?.mileage ? vehicle.mileage.toLocaleString() : '0'} km</TableCell>
                    <TableCell>
                      {vehicle?.lastCheckDate ? new Date(vehicle.lastCheckDate).toLocaleDateString() : 'Non renseigné'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={vehicle?.status === 'available' ? 'default' : 'secondary'}
                      >
                        {vehicle?.status === 'available' ? 'Disponible' : 'En maintenance'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowEditDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddVehicleDialog 
        isOpen={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onVehicleAdded={handleVehicleAdded}
      />

      <ViewVehicleDialog
        isOpen={showViewDialog}
        onClose={() => {
          setShowViewDialog(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
      />

      <EditVehicleDialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        onUpdate={handleUpdateVehicle}
      />

      <DeleteVehicleDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleDeleteVehicle}
        vehicleName={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : ''}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
