
import React, { createContext, useContext, useState } from 'react';
import { TransportVehicle, MaintenanceSchedule } from '../../types/transport-types';

interface PlanningContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  maintenanceDialogOpen: boolean;
  setMaintenanceDialogOpen: (open: boolean) => void;
  selectedVehicle: TransportVehicle | null;
  setSelectedVehicle: (vehicle: TransportVehicle | null) => void;
  handleAddMaintenance: (vehicle: TransportVehicle) => void;
  handleSaveMaintenance: (formData: any) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <PlanningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        maintenanceDialogOpen,
        setMaintenanceDialogOpen,
        selectedVehicle,
        setSelectedVehicle,
        handleAddMaintenance,
        handleSaveMaintenance
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
