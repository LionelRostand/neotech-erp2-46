import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Vehicle, VehicleStatus } from './types/rental-types';
import CreateVehicleDialog from './dialogs/vehicle/CreateVehicleDialog';
import { toast } from 'sonner';
import VehiclesSearchBar from './components/vehicle/VehiclesSearchBar';
import VehiclesStatusFilter from './components/vehicle/VehiclesStatusFilter';
import VehiclesList from './components/vehicle/VehiclesList';

// Mock vehicles data
const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    brand: "Renault",
    model: "Clio",
    year: 2021,
    licensePlate: "AA-123-BC",
    type: "hatchback",
    status: "available",
    dailyRate: 45,
    mileage: 24500,
    features: ["Climatisation", "Bluetooth", "GPS"],
    locationId: "loc1",
    nextMaintenanceDate: "2023-08-15",
    lastMaintenanceDate: "2023-02-15",
    notes: "Bon état général",
    createdAt: "2022-01-15",
    updatedAt: "2023-05-10"
  },
  {
    id: "v2",
    brand: "Peugeot",
    model: "308",
    year: 2020,
    licensePlate: "AB-456-CD",
    type: "hatchback",
    status: "rented",
    dailyRate: 50,
    mileage: 35600,
    features: ["Climatisation", "Bluetooth", "GPS", "Caméra de recul"],
    locationId: "loc1",
    nextMaintenanceDate: "2023-07-20",
    lastMaintenanceDate: "2023-01-20",
    notes: "",
    createdAt: "2022-02-10",
    updatedAt: "2023-06-01"
  },
  {
    id: "v3",
    brand: "Citroen",
    model: "C3",
    year: 2022,
    licensePlate: "AC-789-DE",
    type: "hatchback",
    status: "maintenance",
    dailyRate: 40,
    mileage: 12300,
    features: ["Climatisation", "Bluetooth"],
    locationId: "loc2",
    nextMaintenanceDate: "2023-09-10",
    lastMaintenanceDate: "2023-06-10",
    notes: "En révision pour problème de freins",
    createdAt: "2022-03-05",
    updatedAt: "2023-06-10"
  },
  {
    id: "v4",
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    licensePlate: "AD-012-EF",
    type: "hatchback",
    status: "available",
    dailyRate: 55,
    mileage: 29800,
    features: ["Climatisation", "Bluetooth", "GPS", "Sièges chauffants"],
    locationId: "loc1",
    nextMaintenanceDate: "2023-08-25",
    lastMaintenanceDate: "2023-02-25",
    notes: "",
    createdAt: "2022-01-20",
    updatedAt: "2023-05-15"
  },
  {
    id: "v5",
    brand: "Dacia",
    model: "Duster",
    year: 2020,
    licensePlate: "AE-345-FG",
    type: "suv",
    status: "reserved",
    dailyRate: 60,
    mileage: 42100,
    features: ["Climatisation", "Bluetooth", "GPS", "4x4"],
    locationId: "loc2",
    nextMaintenanceDate: "2023-07-15",
    lastMaintenanceDate: "2023-01-15",
    notes: "",
    createdAt: "2022-02-15",
    updatedAt: "2023-05-20"
  },
  {
    id: "v6",
    brand: "Toyota",
    model: "Yaris",
    year: 2022,
    licensePlate: "AF-678-GH",
    type: "hatchback",
    status: "available",
    dailyRate: 45,
    mileage: 8900,
    features: ["Climatisation", "Bluetooth", "GPS"],
    locationId: "loc1",
    nextMaintenanceDate: "2023-09-05",
    lastMaintenanceDate: "2023-03-05",
    notes: "Véhicule neuf",
    createdAt: "2022-04-10",
    updatedAt: "2023-06-02"
  }
];

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState<"all" | VehicleStatus>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedView === "all" || vehicle.status === selectedView;
    
    return matchesSearch && matchesStatus;
  });

  const handleVehicleCreated = (newVehicle: Vehicle) => {
    setVehicles(prevVehicles => [newVehicle, ...prevVehicles]);
    toast.success('Véhicule ajouté avec succès');
  };

  const handleRefresh = () => {
    setVehicles([...mockVehicles]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Véhicules</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <VehiclesSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onAddVehicle={() => setIsCreateDialogOpen(true)}
      />

      <VehiclesStatusFilter 
        selectedView={selectedView} 
        onViewChange={setSelectedView} 
      />

      <VehiclesList vehicles={filteredVehicles} />

      <CreateVehicleDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onVehicleCreated={handleVehicleCreated}
      />
    </div>
  );
};

export default VehiclesManagement;
