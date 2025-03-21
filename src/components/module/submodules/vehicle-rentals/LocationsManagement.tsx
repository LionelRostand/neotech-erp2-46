
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Plus, TruckIcon, CarTaxiFront } from "lucide-react";
import { Input } from "@/components/ui/input";
import LocationsList from './locations/LocationsList';
import TransfersList from './locations/TransfersList';
import VehiclesByLocation from './locations/VehiclesByLocation';
import CreateLocationDialog from './locations/CreateLocationDialog';
import { Location } from './types/rental-types';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';

const LocationsManagement = () => {
  const [activeTab, setActiveTab] = useState<"locations" | "transfers" | "vehicles">("locations");
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "loc1",
      name: "Agence Centrale Paris",
      address: "123 Avenue des Champs-Élysées, 75008 Paris",
      phone: "+33 1 23 45 67 89",
      email: "paris@autoloc.fr",
      coordinates: {
        latitude: 48.8713,
        longitude: 2.3033
      },
      openingHours: {
        monday: "9:00-19:00",
        tuesday: "9:00-19:00",
        wednesday: "9:00-19:00",
        thursday: "9:00-19:00",
        friday: "9:00-19:00",
        saturday: "10:00-18:00",
        sunday: "Fermé"
      },
      isActive: true,
      createdAt: "2022-01-01",
      updatedAt: "2023-01-15"
    },
    {
      id: "loc2",
      name: "Agence Lyon Part-Dieu",
      address: "47 Boulevard Vivier Merle, 69003 Lyon",
      phone: "+33 4 72 33 44 55",
      email: "lyon@autoloc.fr",
      coordinates: {
        latitude: 45.7608,
        longitude: 4.8574
      },
      openingHours: {
        monday: "9:00-18:30",
        tuesday: "9:00-18:30",
        wednesday: "9:00-18:30",
        thursday: "9:00-18:30",
        friday: "9:00-18:30",
        saturday: "9:30-17:00",
        sunday: "Fermé"
      },
      isActive: true,
      createdAt: "2022-02-15",
      updatedAt: "2023-01-10"
    },
    {
      id: "loc3",
      name: "Point Relais Marseille",
      address: "21 Rue de la Canebière, 13001 Marseille",
      phone: "+33 4 91 22 33 44",
      email: "marseille@autoloc.fr",
      coordinates: {
        latitude: 43.2976,
        longitude: 5.3810
      },
      openingHours: {
        monday: "9:00-18:00",
        tuesday: "9:00-18:00",
        wednesday: "9:00-18:00",
        thursday: "9:00-18:00",
        friday: "9:00-18:00",
        saturday: "10:00-16:00",
        sunday: "Fermé"
      },
      isActive: true,
      createdAt: "2022-03-10",
      updatedAt: "2023-02-05"
    }
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Emplacements</h2>
        <Button 
          onClick={() => setOpenCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouvel emplacement</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Rechercher par nom ou adresse..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Map size={16} />
            <span>Emplacements</span>
          </TabsTrigger>
          <TabsTrigger value="transfers" className="flex items-center gap-2">
            <TruckIcon size={16} />
            <span>Transferts</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <CarTaxiFront size={16} />
            <span>Véhicules par emplacement</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="locations" className="mt-4">
          <LocationsList 
            locations={filteredLocations} 
            onEdit={(location: Location) => console.log("Edit location", location)}
            onDelete={(id: string) => console.log("Delete location", id)}
          />
        </TabsContent>
        
        <TabsContent value="transfers" className="mt-4">
          <TransfersList 
            locations={locations}
          />
        </TabsContent>
        
        <TabsContent value="vehicles" className="mt-4">
          <VehiclesByLocation 
            locations={locations}
          />
        </TabsContent>
      </Tabs>

      <CreateLocationDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={(data: any) => {
          console.log("Create location", data);
          const newLocation: Location = {
            id: `loc${locations.length + 1}`,
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            coordinates: data.coordinates,
            openingHours: data.openingHours,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setLocations([...locations, newLocation]);
          setOpenCreateDialog(false);
        }}
      />
    </div>
  );
};

export default LocationsManagement;
