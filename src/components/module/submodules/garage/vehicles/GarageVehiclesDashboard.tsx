
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Plus, Search, Filter } from "lucide-react";
import StatusBadge from '@/components/module/submodules/StatusBadge';
import AddVehicleDialog from './AddVehicleDialog';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

const GarageVehiclesDashboard = () => {
  const { vehicles, isLoading, refetchVehicles } = useGarageVehicles();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRefresh = () => {
    console.log("Rafraîchissement des données des véhicules...");
    refetchVehicles();
  };

  const handleAddVehicle = () => {
    console.log("Ajout d'un nouveau véhicule...");
    setIsAddDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Véhicules</h1>
        <Button onClick={handleAddVehicle}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un véhicule..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button variant="outline" onClick={handleRefresh}>
          Rafraîchir
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Chargement des véhicules...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
          <p className="text-gray-500 mb-2">Aucun véhicule trouvé</p>
          <Button onClick={handleAddVehicle} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilométrage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{vehicle.licensePlate}</td>
                  <td className="px-4 py-3">{vehicle.make}</td>
                  <td className="px-4 py-3">{vehicle.model}</td>
                  <td className="px-4 py-3">{vehicle.year}</td>
                  <td className="px-4 py-3">{vehicle.mileage}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={vehicle.status} />
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewVehicle(vehicle)}>Voir</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditVehicle(vehicle)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteVehicle(vehicle)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddVehicleDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onVehicleAdded={handleRefresh}
      />

      {selectedVehicle && (
        <>
          <ViewVehicleDialog 
            isOpen={isViewDialogOpen} 
            onOpenChange={setIsViewDialogOpen} 
            vehicle={selectedVehicle} 
          />

          <EditVehicleDialog 
            isOpen={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen} 
            vehicle={selectedVehicle} 
            onVehicleUpdated={handleRefresh}
          />

          <DeleteVehicleDialog 
            isOpen={isDeleteDialogOpen} 
            onOpenChange={setIsDeleteDialogOpen} 
            vehicle={selectedVehicle} 
            onVehicleDeleted={handleRefresh}
          />
        </>
      )}
    </div>
  );
};

export default GarageVehiclesDashboard;
