
import React, { createContext, useContext, useState } from 'react';
import { TransportVehicle, MaintenanceSchedule, ExtensionRequest } from '../../types/transport-types';

// Mock data for vehicles and maintenance schedules
const mockVehicles: TransportVehicle[] = [
  {
    id: "v001",
    name: "Renault Trafic",
    type: "van",
    capacity: 8,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
    color: "white",
    fuelType: "diesel"
  },
  {
    id: "v002",
    name: "Mercedes Sprinter",
    type: "minibus",
    capacity: 15,
    licensePlate: "EF-456-GH",
    available: false,
    status: "maintenance",
    color: "silver",
    fuelType: "diesel"
  }
];

const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "ms001",
    vehicleId: "v002",
    startDate: "2023-11-15",
    endDate: "2023-11-18",
    type: "regular",
    description: "Entretien régulier",
    completed: false,
    technician: "Jean Martin"
  }
];

const mockExtensionRequests: ExtensionRequest[] = [
  {
    id: "ext001",
    reservationId: "res123",
    clientName: "Marie Dupont",
    originalEndDate: "2023-11-20",
    requestedEndDate: "2023-11-25",
    vehicleName: "Mercedes Sprinter",
    status: "pending",
    reason: "Prolongation de séjour"
  }
];

interface PlanningContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  maintenanceDialogOpen: boolean;
  setMaintenanceDialogOpen: (open: boolean) => void;
  selectedVehicle: TransportVehicle | null;
  setSelectedVehicle: (vehicle: TransportVehicle | null) => void;
  handleAddMaintenance: (vehicle: TransportVehicle) => void;
  handleSaveMaintenance: (formData: any) => void;
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: ExtensionRequest[];
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("availability");
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  
  // Adding the mock data to the context
  const [vehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [maintenanceSchedules] = useState<MaintenanceSchedule[]>(mockMaintenanceSchedules);
  const [extensionRequests] = useState<ExtensionRequest[]>(mockExtensionRequests);

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
    <PlanningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        maintenanceDialogOpen,
        setMaintenanceDialogOpen,
        selectedVehicle,
        setSelectedVehicle,
        handleAddMaintenance,
        handleSaveMaintenance,
        vehicles,
        maintenanceSchedules,
        extensionRequests
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
