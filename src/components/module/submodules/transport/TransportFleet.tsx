
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarFront, Plus, Search, Filter, FileText, Wrench, AlertTriangle } from "lucide-react";
import { TransportVehicle } from './types';
import VehiclesTable from './fleet/VehiclesTable';
import VehicleDetails from './fleet/VehicleDetails';
import MaintenanceHistoryList from './fleet/MaintenanceHistoryList';
import IncidentsList from './fleet/IncidentsList';
import AddVehicleDialog from './fleet/AddVehicleDialog';

// Mock vehicles data
const mockVehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
    purchaseDate: "2022-05-15",
    lastServiceDate: "2023-05-20",
    nextServiceDate: "2023-11-20",
    mileage: 25000,
    insuranceInfo: {
      provider: "AXA",
      policyNumber: "POL-12345",
      expiryDate: "2023-12-31"
    },
    notes: [] // Added notes array
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    capacity: 4,
    licensePlate: "EF-456-GH",
    available: false,
    status: "maintenance",
    purchaseDate: "2021-08-10",
    lastServiceDate: "2023-07-12",
    nextServiceDate: "2024-01-12",
    mileage: 42000,
    insuranceInfo: {
      provider: "Allianz",
      policyNumber: "POL-67890",
      expiryDate: "2023-11-15"
    },
    notes: [] // Added notes array
  },
  {
    id: "veh-003",
    name: "Audi A6",
    type: "sedan",
    capacity: 4,
    licensePlate: "IJ-789-KL",
    available: true,
    status: "active",
    purchaseDate: "2022-01-20",
    lastServiceDate: "2023-06-05",
    nextServiceDate: "2023-12-05",
    mileage: 35000,
    insuranceInfo: {
      provider: "Generali",
      policyNumber: "POL-45678",
      expiryDate: "2024-01-20"
    },
    notes: [] // Added notes array
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    capacity: 7,
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
    purchaseDate: "2021-11-05",
    lastServiceDate: "2023-08-18",
    nextServiceDate: "2024-02-18",
    mileage: 48000,
    insuranceInfo: {
      provider: "AXA",
      policyNumber: "POL-98765",
      expiryDate: "2023-10-31"
    },
    notes: [] // Added notes array
  },
  {
    id: "veh-005",
    name: "Tesla Model S",
    type: "luxury",
    capacity: 4,
    licensePlate: "QR-345-ST",
    available: false,
    status: "out-of-service",
    purchaseDate: "2022-03-15",
    lastServiceDate: "2023-09-10",
    nextServiceDate: "2024-03-10",
    mileage: 28000,
    insuranceInfo: {
      provider: "Maif",
      policyNumber: "POL-54321",
      expiryDate: "2024-03-15"
    },
    notes: [] // Added notes array
  }
];

// Mock maintenance history with corrected union types
const mockMaintenanceHistory = [
  {
    id: "mnt-001",
    vehicleId: "veh-001",
    type: "regular" as "regular",
    date: "2023-05-20",
    description: "Changement d'huile et filtres",
    cost: 280,
    provider: "Garage Central",
    nextMaintenance: "2023-11-20",
    resolved: true,
    mileage: 25000
  },
  {
    id: "mnt-002",
    vehicleId: "veh-002",
    type: "repair" as "repair",
    date: "2023-07-12",
    description: "Problème de freins",
    cost: 550,
    provider: "Garage Express",
    nextMaintenance: "2024-01-12",
    resolved: true,
    mileage: 42000
  },
  {
    id: "mnt-003",
    vehicleId: "veh-003",
    type: "inspection" as "inspection",
    date: "2023-06-05",
    description: "Contrôle technique",
    cost: 120,
    provider: "Contrôle Auto",
    nextMaintenance: "2023-12-05",
    resolved: true,
    mileage: 35000
  },
  {
    id: "mnt-004",
    vehicleId: "veh-005",
    type: "repair" as "repair",
    date: "2023-09-10",
    description: "Problème de batterie",
    cost: 1200,
    provider: "ElectroCar",
    nextMaintenance: "2024-03-10",
    resolved: false,
    mileage: 28000
  }
];

// Mock incidents with corrected union types
const mockIncidents = [
  {
    id: "inc-001",
    vehicleId: "veh-002",
    date: "2023-06-15",
    description: "Rayure portière avant droite",
    severity: "low" as "low", // Changed from "minor" to "low" to match enum
    driverName: "Sophie Martin",
    clientName: "Marie Legrand",
    damageDescription: "Rayure superficielle de 20cm",
    repairCost: 150,
    insuranceClaim: false,
    resolved: true,
    status: "closed"
  },
  {
    id: "inc-002",
    vehicleId: "veh-005",
    date: "2023-09-05",
    description: "Problème électrique - véhicule immobilisé",
    severity: "high" as "high", // Changed from "major" to "high" to match enum
    driverName: "Nicolas Durand",
    clientName: "Sophie Bernard",
    damageDescription: "Défaillance du système électrique - remorquage nécessaire",
    repairCost: 1800,
    insuranceClaim: true,
    resolved: false,
    status: "open"
  }
];

const TransportFleet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Filter vehicles based on search term, type and status
  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || vehicle.type === selectedType;
    
    const matchesStatus = selectedStatus === 'all' || vehicle.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
  };
  
  // Get maintenance history for selected vehicle
  const getVehicleMaintenance = (vehicleId: string) => {
    return mockMaintenanceHistory.filter(item => item.vehicleId === vehicleId);
  };
  
  // Get incidents for selected vehicle
  const getVehicleIncidents = (vehicleId: string) => {
    return mockIncidents.filter(item => item.vehicleId === vehicleId);
  };
  
  // Handle add vehicle
  const handleAddVehicle = (formData: any) => {
    console.log("New vehicle data:", formData);
    // In a real application, would add the vehicle to the fleet
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Flotte de Véhicules</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus size={16} />
          <span>Ajouter un véhicule</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou immatriculation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de véhicule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="sedan">Berline</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="luxury">Luxe</SelectItem>
            <SelectItem value="bus">Bus</SelectItem>
            <SelectItem value="minibus">Minibus</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="out-of-service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Liste des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <VehiclesTable 
                vehicles={filteredVehicles} 
                onSelectVehicle={handleSelectVehicle}
                selectedVehicleId={selectedVehicle?.id}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedVehicle ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Détails du véhicule</CardTitle>
                  <Tabs 
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <CarFront size={16} />
                        <span>Information</span>
                      </TabsTrigger>
                      <TabsTrigger value="maintenance" className="flex items-center gap-2">
                        <Wrench size={16} />
                        <span>Maintenance</span>
                      </TabsTrigger>
                      <TabsTrigger value="incidents" className="flex items-center gap-2">
                        <AlertTriangle size={16} />
                        <span>Incidents</span>
                      </TabsTrigger>
                    </TabsList>
                  
                    <TabsContent value="details">
                      <VehicleDetails vehicle={selectedVehicle} />
                    </TabsContent>
                    
                    <TabsContent value="maintenance">
                      <MaintenanceHistoryList 
                        maintenanceRecords={getVehicleMaintenance(selectedVehicle.id)} 
                        vehicleName={selectedVehicle.name}
                      />
                    </TabsContent>
                    
                    <TabsContent value="incidents">
                      <IncidentsList 
                        incidents={getVehicleIncidents(selectedVehicle.id)} 
                        vehicleName={selectedVehicle.name}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {/* Le contenu est maintenant géré par les TabsContent ci-dessus */}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <CarFront className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez un véhicule</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Veuillez sélectionner un véhicule dans la liste pour voir ses détails, son historique de maintenance et les incidents éventuels.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Add Vehicle Dialog */}
      <AddVehicleDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSave={handleAddVehicle}
      />
    </div>
  );
};

export default TransportFleet;
