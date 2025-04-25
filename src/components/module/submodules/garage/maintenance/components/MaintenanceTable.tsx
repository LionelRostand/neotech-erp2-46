
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Vehicle } from '../../../types/garage-types';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';

const MaintenanceTable = () => {
  const { vehicles = [], isLoading } = useGarageData();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marque/Modèle</TableHead>
            <TableHead>Immatriculation</TableHead>
            <TableHead>Propriétaire</TableHead>
            <TableHead>Kilométrage</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernier contrôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Aucun véhicule trouvé
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.clientId}</TableCell>
                <TableCell>{vehicle.mileage} km</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell>{vehicle.lastServiceDate || '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
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
            ))
          )}
        </TableBody>
      </Table>

      <ViewVehicleDialog
        vehicle={selectedVehicle}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditVehicleDialog
        vehicle={selectedVehicle}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteVehicleDialog
        vehicle={selectedVehicle}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default MaintenanceTable;
