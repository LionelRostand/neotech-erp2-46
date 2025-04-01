
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { 
  TransportVehicle, 
  MaintenanceSchedule,
  MapExtensionRequest,
  TransportDriver
} from '../../types/transport-types';
import { 
  mockDrivers, 
  vehicles as mockVehicles
} from '../mockData';

interface PlanningContextType {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: MapExtensionRequest[];
  drivers: TransportDriver[];
  selectedVehicleId: string | null;
  selectedDriverId: string | null;
  selectedDate: Date;
  selectedVehicle?: TransportVehicle | null;
  selectedExtensionRequest?: MapExtensionRequest | null;
  showMaintenanceDialog: boolean;
  showExtensionDetailsDialog: boolean;
  isLoading: boolean;
  setVehicles: (vehicles: TransportVehicle[]) => void;
  setMaintenanceSchedules: (schedules: MaintenanceSchedule[]) => void;
  setExtensionRequests: (requests: MapExtensionRequest[]) => void;
  setDrivers: (drivers: TransportDriver[]) => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSelectedDriverId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
  setShowMaintenanceDialog: (show: boolean) => void;
  setShowExtensionDetailsDialog: (show: boolean) => void;
  approveExtensionRequest: (id: string) => void;
  rejectExtensionRequest: (id: string) => void;
  deleteExtensionRequest: (id: string) => void;
  refreshData: () => void;
  openMaintenanceScheduleDialog: () => void;
  openExtensionDetailsDialog: (id: string) => void;
  handleAddMaintenance: (data: any) => void;
  handleSaveMaintenance: (data: any) => void;
  handleResolveExtension: (id: string, approved: boolean) => void;
}

interface PlanningProviderProps {
  children: ReactNode;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider = ({ children }: PlanningProviderProps) => {
  // Import local data
  const localMaintenanceSchedules: MaintenanceSchedule[] = require('../mockData').maintenanceSchedules;
  const localExtensionRequests: MapExtensionRequest[] = require('../mockData').extensionRequests;
  
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(localMaintenanceSchedules);
  const [extensionRequests, setExtensionRequests] = useState<MapExtensionRequest[]>(localExtensionRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<MapExtensionRequest | null>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);
  
  // Convert mock drivers to ensure they match the TransportDriver type
  const typedMockDrivers: TransportDriver[] = mockDrivers.map(driver => {
    // Map string status to the correct enum value
    let status: 'active' | 'inactive' | 'driving' | 'on_leave' | 'off-duty' = 'active';
    
    // Convert string status to valid enum value
    if (driver.status === 'inactive') status = 'inactive';
    else if (driver.status === 'driving') status = 'driving';
    else if (driver.status === 'on-leave' || driver.status === 'on_leave') status = 'on_leave';
    else if (driver.status === 'off-duty') status = 'off-duty';
    
    return {
      ...driver,
      status,
    } as TransportDriver;
  });
  
  const [drivers, setDrivers] = useState<TransportDriver[]>(typedMockDrivers);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get the selected vehicle
  const selectedVehicle = selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null;

  // Function to approve an extension request
  const approveExtensionRequest = (id: string) => {
    setExtensionRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
  };

  // Function to reject an extension request
  const rejectExtensionRequest = (id: string) => {
    setExtensionRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

  // Function to delete an extension request
  const deleteExtensionRequest = (id: string) => {
    setExtensionRequests(prevRequests =>
      prevRequests.filter(req => req.id !== id)
    );
  };

  // Function to refresh data
  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Open maintenance schedule dialog
  const openMaintenanceScheduleDialog = () => {
    setShowMaintenanceDialog(true);
  };

  // Open extension details dialog
  const openExtensionDetailsDialog = (id: string) => {
    const request = extensionRequests.find(req => req.id === id);
    if (request) {
      setSelectedExtensionRequest(request);
      setShowExtensionDetailsDialog(true);
    }
  };

  // Handle adding maintenance
  const handleAddMaintenance = (data: any) => {
    openMaintenanceScheduleDialog();
  };

  // Handle saving maintenance
  const handleSaveMaintenance = (data: any) => {
    console.log("Saving maintenance data:", data);
    setShowMaintenanceDialog(false);
  };

  // Handle resolve extension
  const handleResolveExtension = (id: string, approved: boolean) => {
    if (approved) {
      approveExtensionRequest(id);
    } else {
      rejectExtensionRequest(id);
    }
    setShowExtensionDetailsDialog(false);
  };

  return (
    <PlanningContext.Provider
      value={{
        vehicles,
        maintenanceSchedules,
        extensionRequests,
        drivers,
        selectedVehicleId,
        selectedDriverId,
        selectedDate,
        selectedVehicle,
        selectedExtensionRequest,
        showMaintenanceDialog,
        showExtensionDetailsDialog,
        isLoading,
        setVehicles,
        setMaintenanceSchedules,
        setExtensionRequests,
        setDrivers,
        setSelectedVehicleId,
        setSelectedDriverId,
        setSelectedDate,
        setShowMaintenanceDialog,
        setShowExtensionDetailsDialog,
        approveExtensionRequest,
        rejectExtensionRequest,
        deleteExtensionRequest,
        refreshData,
        openMaintenanceScheduleDialog,
        openExtensionDetailsDialog,
        handleAddMaintenance,
        handleSaveMaintenance,
        handleResolveExtension,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = (): PlanningContextType => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
