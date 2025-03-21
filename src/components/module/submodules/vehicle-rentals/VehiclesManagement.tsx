
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, Plus, Search, Filter, TrendingUp, Settings, 
  Download, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vehicle, VehicleStatus } from './types/rental-types';

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

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedView === "all" || vehicle.status === selectedView;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Loué</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'reserved':
        return <Badge className="bg-purple-100 text-purple-800">Réservé</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge variant="outline">Indéfini</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Véhicules</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par marque, modèle ou immatriculation..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button variant="ghost" onClick={() => setVehicles([...mockVehicles])}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setSelectedView(value as "all" | VehicleStatus)}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="rented">Loués</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="reserved">Réservés</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Kilométrage</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{vehicle.brand} {vehicle.model}</span>
                      <span className="text-sm text-gray-500">{vehicle.year}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vehicle.type === 'sedan' && 'Berline'}
                      {vehicle.type === 'suv' && 'SUV'}
                      {vehicle.type === 'hatchback' && 'Compacte'}
                      {vehicle.type === 'van' && 'Utilitaire'}
                      {vehicle.type === 'truck' && 'Camion'}
                      {vehicle.type === 'luxury' && 'Luxe'}
                      {vehicle.type === 'convertible' && 'Cabriolet'}
                      {vehicle.type === 'electric' && 'Électrique'}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.mileage.toLocaleString('fr-FR')} km</TableCell>
                  <TableCell>{vehicle.dailyRate}€/jour</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun véhicule trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclesManagement;
