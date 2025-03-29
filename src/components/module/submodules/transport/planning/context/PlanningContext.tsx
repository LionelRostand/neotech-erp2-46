
import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  TransportVehicle,
  TransportDriver,
  MapMaintenanceSchedule as MaintenanceSchedule, 
  MapExtensionRequest as ExtensionRequest 
} from '../../types';
import { mockVehicles, mockDrivers, mockMaintenances, mockExtensions } from '../mockData';

// Define the context types
interface PlanningContextType {
  vehicles: TransportVehicle[];
  drivers: TransportDriver[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: ExtensionRequest[];
  selectedVehicleId: string | null;
  selectedMaintenanceId: string | null;
  selectedExtensionId: string | null;
  isMaintenanceDialogOpen: boolean;
  isExtensionDialogOpen: boolean;
  refreshData: () => void;
  openMaintenanceScheduleDialog: (vehicleId?: string) => void;
  closeMaintenanceScheduleDialog: () => void;
  openExtensionDetailsDialog: (requestId: string) => void;
  closeExtensionDetailsDialog: () => void;
  createMaintenanceSchedule: (data: Omit<MaintenanceSchedule, 'id'>) => void;
  updateMaintenanceSchedule: (id: string, data: Partial<MaintenanceSchedule>) => void;
  deleteMaintenanceSchedule: (id: string) => void;
  getSelectedVehicle: () => TransportVehicle | undefined;
  getSelectedMaintenance: () => MaintenanceSchedule | undefined;
  getSelectedExtension: () => ExtensionRequest | undefined;
}

// Create the context with a default empty value
const PlanningContext = createContext<PlanningContextType>({} as PlanningContextType);

// Hook to use the planning context
export const usePlanning = () => useContext(PlanningContext);

interface PlanningProviderProps {
  children: React.ReactNode;
}

export const PlanningProvider: React.FC<PlanningProviderProps> = ({ children }) => {
  // State for vehicles and related data
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [drivers, setDrivers] = useState<TransportDriver[]>(mockDrivers);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(mockMaintenances);
  const [extensionRequests, setExtensionRequests] = useState<ExtensionRequest[]>(mockExtensions);
  
  // State for selected items and dialog control
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState<string | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);

  // Function to refresh data from API or mock data
  const refreshData = useCallback(() => {
    // In a real app, this would fetch data from an API
    setVehicles(mockVehicles);
    setDrivers(mockDrivers);
    setMaintenanceSchedules(mockMaintenances);
    setExtensionRequests(mockExtensions);
  }, []);

  // Dialog control functions
  const openMaintenanceScheduleDialog = useCallback((vehicleId?: string) => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
      // If a vehicle is selected, check if there's an existing maintenance
      const maintenance = maintenanceSchedules.find(m => m.vehicleId === vehicleId);
      if (maintenance) {
        setSelectedMaintenanceId(maintenance.id);
      }
    } else {
      setSelectedVehicleId(null);
      setSelectedMaintenanceId(null);
    }
    setIsMaintenanceDialogOpen(true);
  }, [maintenanceSchedules]);

  const closeMaintenanceScheduleDialog = useCallback(() => {
    setIsMaintenanceDialogOpen(false);
    setSelectedVehicleId(null);
    setSelectedMaintenanceId(null);
  }, []);

  const openExtensionDetailsDialog = useCallback((requestId: string) => {
    setSelectedExtensionId(requestId);
    setIsExtensionDialogOpen(true);
  }, []);

  const closeExtensionDetailsDialog = useCallback(() => {
    setIsExtensionDialogOpen(false);
    setSelectedExtensionId(null);
  }, []);

  // CRUD operations for maintenance schedules
  const createMaintenanceSchedule = useCallback((data: Omit<MaintenanceSchedule, 'id'>) => {
    const newMaintenance: MaintenanceSchedule = {
      id: uuidv4(),
      ...data,
    };
    setMaintenanceSchedules(prev => [...prev, newMaintenance]);
    closeMaintenanceScheduleDialog();
  }, [closeMaintenanceScheduleDialog]);

  const updateMaintenanceSchedule = useCallback((id: string, data: Partial<MaintenanceSchedule>) => {
    setMaintenanceSchedules(prev => 
      prev.map(item => item.id === id ? { ...item, ...data } : item)
    );
    closeMaintenanceScheduleDialog();
  }, [closeMaintenanceScheduleDialog]);

  const deleteMaintenanceSchedule = useCallback((id: string) => {
    setMaintenanceSchedules(prev => prev.filter(item => item.id !== id));
    closeMaintenanceScheduleDialog();
  }, [closeMaintenanceScheduleDialog]);

  // Helper functions to get selected items
  const getSelectedVehicle = useCallback(() => {
    if (!selectedVehicleId) return undefined;
    return vehicles.find(v => v.id === selectedVehicleId);
  }, [selectedVehicleId, vehicles]);

  const getSelectedMaintenance = useCallback(() => {
    if (!selectedMaintenanceId) return undefined;
    return maintenanceSchedules.find(m => m.id === selectedMaintenanceId);
  }, [selectedMaintenanceId, maintenanceSchedules]);

  const getSelectedExtension = useCallback(() => {
    if (!selectedExtensionId) return undefined;
    return extensionRequests.find(e => e.id === selectedExtensionId);
  }, [selectedExtensionId, extensionRequests]);

  // Create the context value object
  const contextValue: PlanningContextType = {
    vehicles,
    drivers,
    maintenanceSchedules,
    extensionRequests,
    selectedVehicleId,
    selectedMaintenanceId,
    selectedExtensionId,
    isMaintenanceDialogOpen,
    isExtensionDialogOpen,
    refreshData,
    openMaintenanceScheduleDialog,
    closeMaintenanceScheduleDialog,
    openExtensionDetailsDialog,
    closeExtensionDetailsDialog,
    createMaintenanceSchedule,
    updateMaintenanceSchedule,
    deleteMaintenanceSchedule,
    getSelectedVehicle,
    getSelectedMaintenance,
    getSelectedExtension
  };

  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};
