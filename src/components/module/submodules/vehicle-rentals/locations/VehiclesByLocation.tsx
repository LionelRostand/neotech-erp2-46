
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Location } from '../types/rental-types';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vehicle, VehicleStatus } from '../types/rental-types';
import { Car, FilterX, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehiclesByLocationProps {
  locations: Location[];
}

// Données simulées des véhicules pour chaque emplacement
const mockVehicles: { [key: string]: Vehicle[] } = {
  loc1: [
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
    }
  ],
  loc2: [
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
    }
  ],
  loc3: [
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
      locationId: "loc3",
      nextMaintenanceDate: "2023-09-10",
      lastMaintenanceDate: "2023-06-10",
      notes: "En révision pour problème de freins",
      createdAt: "2022-03-05",
      updatedAt: "2023-06-10"
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
      locationId: "loc3",
      nextMaintenanceDate: "2023-09-05",
      lastMaintenanceDate: "2023-03-05",
      notes: "Véhicule neuf",
      createdAt: "2022-04-10",
      updatedAt: "2023-06-02"
    }
  ]
};

const VehiclesByLocation: React.FC<VehiclesByLocationProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");

  const filteredVehicles = selectedLocation
    ? (mockVehicles[selectedLocation] || []).filter(vehicle => {
        const matchesSearch = 
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
    : [];

  const getVehicleCount = (locationId: string) => {
    return mockVehicles[locationId]?.length || 0;
  };

  const getAvailableVehicleCount = (locationId: string) => {
    return mockVehicles[locationId]?.filter(v => v.status === 'available').length || 0;
  };

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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map(location => (
          <Card 
            key={location.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedLocation === location.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedLocation(location.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium truncate">{location.name}</h3>
                  <p className="text-gray-500 text-sm truncate">{location.address}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="mb-1">
                    {getVehicleCount(location.id)} véhicules
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    {getAvailableVehicleCount(location.id)} disponibles
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLocation && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {locations.find(l => l.id === selectedLocation)?.name || "Emplacement sélectionné"}
                </CardTitle>
                <CardDescription>
                  {getVehicleCount(selectedLocation)} véhicules • {getAvailableVehicleCount(selectedLocation)} disponibles
                </CardDescription>
              </div>

              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-9 w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="rented">Loué</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Réservé</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetFilters}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Kilométrage</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <div>
                          {vehicle.brand} {vehicle.model}
                          <div className="text-xs text-gray-500">{vehicle.year}</div>
                        </div>
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
                    <TableCell>{vehicle.dailyRate}€/jour</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString('fr-FR')} km</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  </TableRow>
                ))}
                
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm || statusFilter !== "all"
                        ? "Aucun véhicule ne correspond aux critères"
                        : "Aucun véhicule sur cet emplacement"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehiclesByLocation;
