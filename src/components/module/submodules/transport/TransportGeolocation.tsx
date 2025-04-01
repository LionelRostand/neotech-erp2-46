import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Bell, Settings } from 'lucide-react';
import { TransportVehicleWithLocation } from './types/map-types';
import AlertDetailsDialog from './geolocation/AlertDetailsDialog';
import AlertConfigDialog from './geolocation/AlertConfigDialog';
import VehicleMap from './geolocation/VehicleMap';
import VehicleList from './geolocation/VehicleList';
import AlertsList from './geolocation/AlertsList';
import { useToast } from '@/hooks/use-toast';

// Mocked data - in a real app this would come from an API
const mockVehicles: TransportVehicleWithLocation[] = [
  {
    id: "v1",
    name: "Mercedes S-Class",
    type: "luxury",
    licensePlate: "FR-785-AB",
    capacity: 4,
    available: true,
    status: "active",
    location: {
      vehicleId: "v1",
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      timestamp: new Date().toISOString(),
      status: "moving",
      heading: 45,
      speed: 60
    },
    notes: []  // Added notes property
  },
  {
    id: "v2",
    name: "Renault Trafic",
    type: "van",
    licensePlate: "FR-456-CD",
    capacity: 8,
    available: true,
    status: "active",
    location: {
      vehicleId: "v2",
      coordinates: { latitude: 48.8756, longitude: 2.3522 },
      timestamp: new Date().toISOString(),
      status: "idle",
      heading: 90,
      speed: 0
    },
    notes: []  // Added notes property
  },
  {
    id: "v3",
    name: "Volkswagen Transporter",
    type: "shuttle",
    licensePlate: "FR-123-EF",
    capacity: 9,
    available: false,
    status: "maintenance",
    location: {
      vehicleId: "v3",
      coordinates: { latitude: 48.8566, longitude: 2.3722 },
      timestamp: new Date().toISOString(),
      status: "stopped",
      heading: 0,
      speed: 0
    },
    notes: []  // Added notes property
  },
  {
    id: "v4",
    name: "Tesla Model S",
    type: "electric",
    licensePlate: "FR-999-ZZ",
    capacity: 5,
    available: true,
    status: "active",
    location: {
      vehicleId: "v4",
      coordinates: { latitude: 48.8366, longitude: 2.3422 },
      timestamp: new Date().toISOString(),
      status: "idle",
      heading: 270,
      speed: 0
    },
    notes: []  // Added notes property
  }
];

const TransportGeolocation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleWithLocation | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isAlertConfigOpen, setIsAlertConfigOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Filter vehicles based on search term
  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: TransportVehicleWithLocation) => {
    setSelectedVehicle(vehicle);
  };
  
  // Handle alert dialog open
  const handleOpenAlertDialog = () => {
    if (selectedVehicle) {
      setIsAlertDialogOpen(true);
    } else {
      toast({
        title: "Sélectionnez un véhicule",
        description: "Veuillez sélectionner un véhicule pour configurer les alertes.",
      });
    }
  };
  
  // Handle alert config open
  const handleOpenAlertConfig = () => {
    setIsAlertConfigOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Géolocalisation</h2>
        <Button onClick={handleOpenAlertConfig}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurer les alertes</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un véhicule..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Suivi des véhicules</CardTitle>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Carte</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Bell size={16} />
                  <span>Alertes</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Map */}
            <div className={activeTab === 'map' ? '' : 'hidden'}>
              <VehicleMap 
                vehicles={filteredVehicles} 
                selectedVehicle={selectedVehicle}
                mapContainerRef={mapContainerRef}
              />
            </div>
            
            {/* Alerts List */}
            <div className={activeTab === 'list' ? '' : 'hidden'}>
              <AlertsList />
            </div>
            
            {/* Vehicle List */}
            <VehicleList 
              vehicles={filteredVehicles} 
              onSelectVehicle={handleSelectVehicle}
              selectedVehicleId={selectedVehicle?.id}
              onOpenAlertDialog={handleOpenAlertDialog}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Alert Details Dialog */}
      {selectedVehicle && (
        <AlertDetailsDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
          vehicle={selectedVehicle}
        />
      )}
      
      {/* Alert Config Dialog */}
      <AlertConfigDialog
        open={isAlertConfigOpen}
        onOpenChange={setIsAlertConfigOpen}
      />
    </div>
  );
};

export default TransportGeolocation;
