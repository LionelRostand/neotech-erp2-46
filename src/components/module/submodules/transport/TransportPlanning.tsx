import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calendar, CarFront, Clock, RefreshCw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TransportVehicle, MaintenanceSchedule } from './types/transport-types';
import AvailabilityCalendar from './planning/AvailabilityCalendar';
import MaintenanceScheduleList from './planning/MaintenanceScheduleList';
import ExtensionRequestsList from './planning/ExtensionRequestsList';
import MaintenanceScheduleDialog from './planning/MaintenanceScheduleDialog';

// Mock vehicle data
const mockVehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    capacity: 4,
    licensePlate: "EF-456-GH",
    available: false,
    status: "maintenance",
  },
  {
    id: "veh-003",
    name: "Audi A6",
    type: "sedan",
    capacity: 4,
    licensePlate: "IJ-789-KL",
    available: true,
    status: "active",
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    capacity: 7,
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
  },
  {
    id: "veh-005",
    name: "Tesla Model S",
    type: "luxury",
    capacity: 4,
    licensePlate: "QR-345-ST",
    available: false,
    status: "out-of-service",
  }
];

// Mock maintenance schedules
const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "mnt-001",
    vehicleId: "veh-002",
    startDate: "2023-11-20",
    endDate: "2023-11-22",
    type: "regular",
    description: "Changement d'huile et filtres",
    completed: false,
    technician: "Garage Central",
    notes: "Inclure vérification des freins"
  },
  {
    id: "mnt-002",
    vehicleId: "veh-005",
    startDate: "2023-11-15",
    endDate: "2023-11-25",
    type: "repair",
    description: "Réparation système électrique",
    completed: false,
    technician: "ElectroCar",
    notes: "Problème de batterie détecté lors de la dernière location"
  },
  {
    id: "mnt-003",
    vehicleId: "veh-001",
    startDate: "2023-12-05",
    endDate: "2023-12-06",
    type: "inspection",
    description: "Contrôle technique annuel",
    completed: false,
    technician: "Contrôle Auto",
    notes: "Rendez-vous à 9h"
  }
];

// Mock extension requests with corrected union types
const mockExtensionRequests = [
  {
    id: "ext-001",
    reservationId: "TR-2023-002",
    clientName: "Marie Legrand",
    originalEndDate: "2023-11-21",
    requestedEndDate: "2023-11-23",
    vehicleName: "BMW Série 5",
    status: "pending" as "pending",
    reason: "Prolongation voyage d'affaires"
  },
  {
    id: "ext-002",
    reservationId: "TR-2023-004",
    clientName: "Sophie Bernard",
    originalEndDate: "2023-11-20",
    requestedEndDate: "2023-11-22",
    vehicleName: "Mercedes Classe V",
    status: "approved" as "approved",
    reason: "Besoin supplémentaire du véhicule"
  }
];

const TransportPlanning = () => {
  const [activeTab, setActiveTab] = useState("availability");
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);

  // Handler for opening maintenance schedule dialog
  const handleAddMaintenance = (vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setMaintenanceDialogOpen(true);
  };

  // Handler for saving maintenance schedule
  const handleSaveMaintenance = (formData: any) => {
    console.log("Saving maintenance schedule:", formData);
    // In a real app, would add this to the maintenance schedules
    // and update the vehicle availability
    setMaintenanceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Planning des Transports</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw size={16} />
            <span>Actualiser</span>
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Planifier maintenance</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Planning et disponibilités</CardTitle>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-[600px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="availability" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Disponibilité des véhicules</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-2">
                  <CarFront size={16} />
                  <span>Périodes de maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="extensions" className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Prolongations</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="availability" className="mt-0">
            <AvailabilityCalendar 
              vehicles={mockVehicles} 
              maintenanceSchedules={mockMaintenanceSchedules}
              onAddMaintenance={handleAddMaintenance}
            />
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-0">
            <MaintenanceScheduleList 
              maintenanceSchedules={mockMaintenanceSchedules}
              vehicles={mockVehicles}
              onAddMaintenance={() => setMaintenanceDialogOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="extensions" className="mt-0">
            <ExtensionRequestsList extensionRequests={mockExtensionRequests} />
          </TabsContent>
        </CardContent>
      </Card>

      {/* Maintenance Schedule Dialog */}
      {maintenanceDialogOpen && (
        <MaintenanceScheduleDialog
          open={maintenanceDialogOpen}
          onOpenChange={setMaintenanceDialogOpen}
          vehicles={mockVehicles}
          selectedVehicle={selectedVehicle}
          onSave={handleSaveMaintenance}
        />
      )}
    </div>
  );
};

export default TransportPlanning;
