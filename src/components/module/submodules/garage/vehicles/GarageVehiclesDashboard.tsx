
import React, { useState } from 'react';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddVehicleDialog from './AddVehicleDialog';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { vehicles, loading, refetchVehicles } = useGarageVehicles();

  const handleVehicleAdded = async () => {
    await refetchVehicles();
    setShowAddDialog(false);
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
              {vehicles.filter(v => v.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter(v => v.status === 'available').length}
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
                    {vehicle.mileage != null && typeof vehicle.mileage === 'number' 
                      ? vehicle.mileage.toLocaleString() + ' km'
                      : 'Non renseigné'}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddVehicleDialog 
        isOpen={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
