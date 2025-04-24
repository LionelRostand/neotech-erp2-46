
import React, { useState } from 'react';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Vehicle } from '../types/garage-types';
import AddVehicleDialog from './AddVehicleDialog';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import StatCard from '@/components/StatCard';

const GarageVehiclesDashboard = () => {
  const { vehicles, loading, refetchVehicles } = useGarageVehicles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleAdded = async () => {
    await refetchVehicles();
    setShowAddDialog(false);
  };

  const handleUpdate = async (id: string, data: Partial<Vehicle>) => {
    setIsLoading(true);
    try {
      // Call your update function here
      // await updateVehicle(id, data);
      await refetchVehicles();
      toast.success('Véhicule mis à jour avec succès');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Erreur lors de la mise à jour du véhicule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;
    
    setIsLoading(true);
    try {
      // Call your delete function here
      // await deleteVehicle(selectedVehicle.id);
      await refetchVehicles();
      setDeleteDialogOpen(false);
      toast.success('Véhicule supprimé avec succès');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Erreur lors de la suppression du véhicule');
    } finally {
      setIsLoading(false);
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
        <StatCard
          title="Total Véhicules"
          value={vehicles.length.toString()}
          description="Tous les véhicules"
        />
        <StatCard
          title="En Maintenance"
          value={vehicles.filter(v => v.status === 'maintenance').length.toString()}
          description="Véhicules en maintenance"
        />
        <StatCard
          title="Disponibles"
          value={vehicles.filter(v => v.status === 'available').length.toString()}
          description="Véhicules disponibles"
        />
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
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    {vehicle.mileage?.toLocaleString()} km
                  </TableCell>
                  <TableCell>
                    {vehicle.lastCheckDate ? new Date(vehicle.lastCheckDate).toLocaleDateString() : 'Non renseigné'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                    >
                      {vehicle.status === 'available' ? 'Disponible' : 'En maintenance'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedVehicle && (
        <>
          <ViewVehicleDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            vehicle={selectedVehicle}
          />

          <EditVehicleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            vehicle={selectedVehicle}
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />

          <DeleteVehicleDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            vehicleInfo={`${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})`}
            isLoading={isLoading}
          />
        </>
      )}

      <AddVehicleDialog 
        isOpen={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
