
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import { Vehicle } from '../../../types/garage-types';

const MaintenanceTable = () => {
  const { vehicles = [], refetchVehicles } = useGarageVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditDialogOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    refetchVehicles();
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Marque/Modèle</th>
              <th className="text-left p-2">Immatriculation</th>
              <th className="text-left p-2">Propriétaire</th>
              <th className="text-left p-2">Kilométrage</th>
              <th className="text-left p-2">Statut</th>
              <th className="text-left p-2">Dernier contrôle</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{vehicle.brand || vehicle.make} {vehicle.model}</td>
                <td className="p-2">{vehicle.registrationNumber || vehicle.licensePlate}</td>
                <td className="p-2">{vehicle.clientId}</td>
                <td className="p-2">{vehicle.mileage} km</td>
                <td className="p-2">{vehicle.status}</td>
                <td className="p-2">{vehicle.lastServiceDate || vehicle.lastCheckDate || '-'}</td>
                <td className="p-2 text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleView(vehicle)}
                  >
                    Voir
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(vehicle)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ViewVehicleDialog
        vehicle={selectedVehicle}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
      
      <EditVehicleDialog
        vehicle={selectedVehicle}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleRefresh}
      />
      
      <DeleteVehicleDialog
        vehicle={selectedVehicle}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default MaintenanceTable;
