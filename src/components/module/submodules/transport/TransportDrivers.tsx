
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Plus, Search, Filter, Star, CalendarClock, TrendingUp } from "lucide-react";
import { TransportDriver } from './types/transport-types';
import DriversTable from './drivers/DriversTable';
import DriverDetails from './drivers/DriverDetails';
import DriverPerformance from './drivers/DriverPerformance';
import DriverAvailability from './drivers/DriverAvailability';
import AddDriverDialog from './drivers/AddDriverDialog';

// Mock drivers data
const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Marc",
    lastName: "Leblanc",
    phone: "+33612345678",
    email: "marc.leblanc@example.com",
    licenseNumber: "12AB34567",
    licenseExpiry: "2025-06-30",
    available: true,
    rating: 4.8,
    experience: 5,
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "active",
    performance: {
      onTimeRate: 97,
      customerSatisfaction: 4.8,
      safetyScore: 95
    }
  },
  {
    id: "drv-002",
    firstName: "Sophie",
    lastName: "Martin",
    phone: "+33623456789",
    email: "sophie.martin@example.com",
    licenseNumber: "23CD45678",
    licenseExpiry: "2024-09-15",
    available: true,
    rating: 4.9,
    experience: 7,
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "active",
    performance: {
      onTimeRate: 99,
      customerSatisfaction: 4.9,
      safetyScore: 98
    }
  },
  {
    id: "drv-003",
    firstName: "Nicolas",
    lastName: "Durand",
    phone: "+33634567890",
    email: "nicolas.durand@example.com",
    licenseNumber: "34EF56789",
    licenseExpiry: "2024-03-22",
    available: false,
    rating: 4.7,
    experience: 4,
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "on-leave",
    performance: {
      onTimeRate: 95,
      customerSatisfaction: 4.7,
      safetyScore: 92
    }
  },
  {
    id: "drv-004",
    firstName: "Pierre",
    lastName: "Moreau",
    phone: "+33645678901",
    email: "pierre.moreau@example.com",
    licenseNumber: "45GH67890",
    licenseExpiry: "2025-01-10",
    available: true,
    rating: 4.5,
    experience: 3,
    photo: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "active",
    performance: {
      onTimeRate: 94,
      customerSatisfaction: 4.5,
      safetyScore: 91
    }
  },
  {
    id: "drv-005",
    firstName: "Julie",
    lastName: "Leroy",
    phone: "+33656789012",
    email: "julie.leroy@example.com",
    licenseNumber: "56IJ78901",
    licenseExpiry: "2024-11-05",
    available: false,
    rating: 4.9,
    experience: 6,
    photo: "https://randomuser.me/api/portraits/women/5.jpg",
    status: "inactive",
    performance: {
      onTimeRate: 98,
      customerSatisfaction: 4.9,
      safetyScore: 97
    }
  }
];

// Mock assigned reservations
const mockAssignedReservations = [
  {
    id: "TR-2023-001",
    driverId: "drv-001",
    clientName: "Jean Dupont",
    service: "airport-transfer",
    date: "2023-12-05",
    time: "09:30",
    pickup: "Aéroport Charles de Gaulle, Terminal 2E",
    dropoff: "Hôtel Ritz Paris, 15 Place Vendôme, 75001 Paris",
    status: "confirmed"
  },
  {
    id: "TR-2023-003",
    driverId: "drv-002",
    clientName: "Thomas Petit",
    service: "business-travel",
    date: "2023-12-06",
    time: "10:15",
    pickup: "Tour Eiffel, Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
    dropoff: "La Défense, 92400 Courbevoie",
    status: "confirmed"
  },
  {
    id: "TR-2023-006",
    driverId: "drv-001",
    clientName: "Philippe Dupuis",
    service: "hourly-hire",
    date: "2023-12-08",
    time: "14:00",
    pickup: "Hôtel InterContinental Paris Le Grand, 2 Rue Scribe, 75009 Paris",
    dropoff: "Hôtel InterContinental Paris Le Grand, 2 Rue Scribe, 75009 Paris",
    status: "confirmed"
  }
];

const TransportDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<TransportDriver | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // Filter drivers based on search term
  const filteredDrivers = mockDrivers.filter(driver => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           driver.phone.includes(searchTerm);
  });
  
  // Handle driver selection
  const handleSelectDriver = (driver: TransportDriver) => {
    setSelectedDriver(driver);
  };
  
  // Get reservations for selected driver
  const getDriverReservations = (driverId: string) => {
    return mockAssignedReservations.filter(res => res.driverId === driverId);
  };
  
  // Handle adding a driver
  const handleAddDriver = (formData: any) => {
    console.log("New driver data:", formData);
    // In a real application, would add the driver to the database
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Chauffeurs</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus size={16} />
          <span>Ajouter un chauffeur</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un chauffeur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Liste des chauffeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <DriversTable 
                drivers={filteredDrivers} 
                onSelectDriver={handleSelectDriver}
                selectedDriverId={selectedDriver?.id}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedDriver ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Profil du chauffeur</CardTitle>
                  <Tabs 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-[400px]"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <UserCircle size={16} />
                        <span>Détails</span>
                      </TabsTrigger>
                      <TabsTrigger value="availability" className="flex items-center gap-2">
                        <CalendarClock size={16} />
                        <span>Disponibilité</span>
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        <span>Performance</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="details" className="mt-0">
                  <DriverDetails driver={selectedDriver} />
                </TabsContent>
                
                <TabsContent value="availability" className="mt-0">
                  <DriverAvailability 
                    driver={selectedDriver} 
                    assignedReservations={getDriverReservations(selectedDriver.id)}
                  />
                </TabsContent>
                
                <TabsContent value="performance" className="mt-0">
                  <DriverPerformance driver={selectedDriver} />
                </TabsContent>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <UserCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez un chauffeur</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Veuillez sélectionner un chauffeur dans la liste pour voir ses détails, sa disponibilité et ses performances.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Add Driver Dialog */}
      <AddDriverDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleAddDriver}
      />
    </div>
  );
};

export default TransportDrivers;
