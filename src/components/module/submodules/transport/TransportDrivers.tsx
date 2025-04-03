
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, UserIcon, Clock, Star, FileText } from "lucide-react";
import { TransportDriver } from './types';
import DriversTable from './drivers/DriversTable';
import DriverDetails from './drivers/DriverDetails';
import DriverAvailability from './drivers/DriverAvailability';
import DriverPerformance from './drivers/DriverPerformance';
import AddDriverDialog from './drivers/AddDriverDialog';
import DriverNoteDialog from './drivers/DriverNoteDialog';

// Mock data - would come from API in real app
const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    licenseNumber: "123456789",
    licenseType: "B",
    licenseExpiry: "2025-06-15",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
    address: "15 rue des Lilas, 75001 Paris",
    status: "active",
    rating: 4.8,
    hireDate: "2019-03-10",
    preferredVehicleType: ["sedan"],
    available: true,
    onLeave: false,
    experience: 4,
    photo: "/assets/drivers/driver1.jpg",
    language: ["French", "English"],
    notes: [],
    licensesTypes: ["B"]
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Laurent",
    licenseNumber: "987654321",
    licenseType: "B",
    licenseExpiry: "2024-11-30",
    phone: "07 98 76 54 32",
    email: "marie.laurent@example.com",
    address: "8 avenue Victor Hugo, 75016 Paris",
    status: "driving",
    rating: 4.5,
    hireDate: "2020-01-15",
    preferredVehicleType: ["van"],
    available: false,
    onLeave: false,
    experience: 3,
    photo: "/assets/drivers/driver2.jpg",
    language: ["French"],
    notes: [],
    licensesTypes: ["B"]
  },
  {
    id: "drv-003",
    firstName: "Pierre",
    lastName: "Martin",
    licenseNumber: "456789123",
    licenseType: "D",
    licenseExpiry: "2023-12-25",
    phone: "06 45 67 89 12",
    email: "pierre.martin@example.com",
    address: "22 rue de la République, 69002 Lyon",
    status: "off-duty",
    rating: 4.2,
    hireDate: "2018-06-22",
    preferredVehicleType: ["bus"],
    available: false,
    onLeave: false,
    experience: 5,
    photo: "/assets/drivers/driver3.jpg",
    language: ["French", "Spanish"],
    notes: [],
    licensesTypes: ["D"]
  },
  {
    id: "drv-004",
    firstName: "Sophie",
    lastName: "Moreau",
    licenseNumber: "321654987",
    licenseType: "B",
    licenseExpiry: "2024-08-10",
    phone: "07 32 16 54 98",
    email: "sophie.moreau@example.com",
    address: "5 rue des Pyrénées, 31000 Toulouse",
    status: "active",
    rating: 4.9,
    hireDate: "2021-02-05",
    preferredVehicleType: ["luxury"],
    available: true,
    onLeave: false,
    experience: 2,
    photo: "/assets/drivers/driver4.jpg",
    language: ["French", "English", "German"],
    notes: [],
    licensesTypes: ["B"]
  },
  {
    id: "drv-005",
    firstName: "Thomas",
    lastName: "Bernard",
    licenseNumber: "789123456",
    licenseType: "B+E",
    licenseExpiry: "2025-01-20",
    phone: "06 78 91 23 45",
    email: "thomas.bernard@example.com",
    address: "12 boulevard de la Mer, 06000 Nice",
    status: "driving",
    rating: 4.7,
    hireDate: "2019-11-18",
    preferredVehicleType: ["sedan"],
    available: false,
    onLeave: false,
    experience: 3,
    photo: "/assets/drivers/driver5.jpg",
    language: ["French", "Italian"],
    notes: [],
    licensesTypes: ["B", "BE"]
  }
];

const TransportDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<TransportDriver | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddDriverDialog, setShowAddDriverDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  
  // Filter drivers based on search term and status
  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = 
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle driver selection
  const handleSelectDriver = (driver: TransportDriver) => {
    setSelectedDriver(driver);
  };
  
  // Handle add driver
  const handleAddDriver = (formData: any) => {
    console.log("New driver data:", formData);
    // In a real application, would add the driver to the backend
    setShowAddDriverDialog(false);
  };
  
  // Handle add note - updated to match DriverNoteDialog's expected type
  const handleAddNote = (data: { title: string; note: string }) => {
    console.log(`Adding note for driver ${selectedDriver?.id}: ${data.title} - ${data.note}`);
    // In a real application, would save the note to the backend
    setShowNoteDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Chauffeurs</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddDriverDialog(true)}
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
            placeholder="Rechercher par nom ou numéro de permis..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="on-duty">En service</SelectItem>
            <SelectItem value="unavailable">Indisponible</SelectItem>
          </SelectContent>
        </Select>
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
                  <CardTitle>Détails du chauffeur</CardTitle>
                  <Tabs 
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <UserIcon size={16} />
                        <span>Information</span>
                      </TabsTrigger>
                      <TabsTrigger value="availability" className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Disponibilité</span>
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Star size={16} />
                        <span>Performance</span>
                      </TabsTrigger>
                    </TabsList>
                  
                    <TabsContent value="details">
                      <DriverDetails 
                        driver={selectedDriver}
                      />
                    </TabsContent>
                    
                    <TabsContent value="availability">
                      <DriverAvailability 
                        driver={selectedDriver}
                        assignedReservations={[]} // Add mock or empty data
                      />
                    </TabsContent>
                    
                    <TabsContent value="performance">
                      <DriverPerformance 
                        driver={selectedDriver}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {/* Contenu géré par les TabsContent ci-dessus */}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
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
        open={showAddDriverDialog} 
        onOpenChange={setShowAddDriverDialog}
        onSave={handleAddDriver}
      />
      
      {/* Add Note Dialog */}
      {selectedDriver && (
        <DriverNoteDialog
          open={showNoteDialog}
          onOpenChange={setShowNoteDialog}
          driver={selectedDriver}
          onSave={handleAddNote}
        />
      )}
    </div>
  );
};

export default TransportDrivers;
