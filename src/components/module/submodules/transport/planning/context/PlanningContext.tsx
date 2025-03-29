
import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  TransportVehicle,
  TransportDriver,
  VehicleMaintenanceSchedule as MaintenanceSchedule,
  MapExtensionRequest as ExtensionRequest 
} from '../../types';
import { mockVehicles, mockDrivers, mockMaintenanceSchedules, mockExtensionRequests } from '../mockData';

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
  isLoading: boolean;
  selectedVehicle?: TransportVehicle;
  selectedExtensionRequest?: ExtensionRequest;
  showMaintenanceDialog: boolean;
  setShowMaintenanceDialog: (show: boolean) => void;
  showExtensionDetailsDialog: boolean;
  setShowExtensionDetailsDialog: (show: boolean) => void;
  refreshData: () => void;
  openMaintenanceScheduleDialog: (vehicleId?: string | null) => void;
  closeMaintenanceScheduleDialog: () => void;
  openExtensionDetailsDialog: (requestId: string) => void;
  closeExtensionDetailsDialog: () => void;
  createMaintenanceSchedule: (data: Omit<MaintenanceSchedule, 'id'>) => void;
  updateMaintenanceSchedule: (id: string, data: Partial<MaintenanceSchedule>) => void;
  deleteMaintenanceSchedule: (id: string) => void;
  getSelectedVehicle: () => TransportVehicle | undefined;
  getSelectedMaintenance: () => MaintenanceSchedule | undefined;
  getSelectedExtension: () => ExtensionRequest | undefined;
  handleAddMaintenance: (vehicle: TransportVehicle | null) => void;
  handleSaveMaintenance: (data: any) => void;
  setSelectedExtensionRequest: (request: ExtensionRequest) => void;
  handleResolveExtension: (id: string, approved: boolean) => void;
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
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(mockMaintenanceSchedules);
  const [extensionRequests, setExtensionRequests] = useState<ExtensionRequest[]>(mockExtensionRequests);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for selected items and dialog control
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState<string | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<ExtensionRequest | undefined>(undefined);

  // Function to refresh data from API or mock data
  const refreshData = useCallback(() => {
    setIsLoading(true);
    
    // In a real app, this would fetch data from an API
    setTimeout(() => {
      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
      setMaintenanceSchedules(mockMaintenanceSchedules);
      setExtensionRequests(mockExtensionRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Dialog control functions
  const openMaintenanceScheduleDialog = useCallback((vehicleId?: string | null) => {
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
    setShowMaintenanceDialog(true);
  }, [maintenanceSchedules]);

  const closeMaintenanceScheduleDialog = useCallback(() => {
    setShowMaintenanceDialog(false);
    setSelectedVehicleId(null);
    setSelectedMaintenanceId(null);
  }, []);

  const openExtensionDetailsDialog = useCallback((requestId: string) => {
    const request = extensionRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedExtensionRequest(request);
      setSelectedExtensionId(requestId);
      setShowExtensionDetailsDialog(true);
    }
  }, [extensionRequests]);

  const closeExtensionDetailsDialog = useCallback(() => {
    setShowExtensionDetailsDialog(false);
    setSelectedExtensionId(null);
    setSelectedExtensionRequest(undefined);
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

  // Handler for adding a maintenance
  const handleAddMaintenance = useCallback((vehicle: TransportVehicle | null) => {
    if (vehicle) {
      setSelectedVehicleId(vehicle.id);
    } else {
      setSelectedVehicleId(null);
    }
    setShowMaintenanceDialog(true);
  }, []);

  // Handler for saving maintenance data
  const handleSaveMaintenance = useCallback((data: any) => {
    // If editing an existing maintenance
    if (selectedMaintenanceId) {
      updateMaintenanceSchedule(selectedMaintenanceId, data);
    } else {
      // If creating a new maintenance
      createMaintenanceSchedule(data);
    }
  }, [selectedMaintenanceId, updateMaintenanceSchedule, createMaintenanceSchedule]);

  // Handler for resolving extension requests
  const handleResolveExtension = useCallback((id: string, approved: boolean) => {
    setExtensionRequests(prev => 
      prev.map(item => item.id === id ? { ...item, status: approved ? 'approved' : 'rejected' } : item)
    );
    setShowExtensionDetailsDialog(false);
  }, []);

  // Computed property for the selected vehicle
  const selectedVehicle = getSelectedVehicle();

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
    isLoading,
    selectedVehicle,
    selectedExtensionRequest,
    showMaintenanceDialog,
    setShowMaintenanceDialog,
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog,
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
    getSelectedExtension,
    handleAddMaintenance,
    handleSaveMaintenance,
    setSelectedExtensionRequest,
    handleResolveExtension
  };

  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};
