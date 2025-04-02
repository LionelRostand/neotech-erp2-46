import React, { createContext, useContext, useState, useCallback } from 'react';
import { TransportVehicle, TransportDriver, MaintenanceSchedule, MapExtensionRequest } from '../../types';
import { mockVehicles, mockMaintenanceSchedules, mockExtensionRequests, mockDrivers } from '../mockData';

interface PlanningContextType {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: MapExtensionRequest[];
  drivers: TransportDriver[];
  selectedVehicle: TransportVehicle | null;
  setSelectedVehicle: (vehicle: TransportVehicle | null) => void;
  selectedMaintenanceSchedule: MaintenanceSchedule | null;
  setSelectedMaintenanceSchedule: (schedule: MaintenanceSchedule | null) => void;
  selectedExtensionRequest: MapExtensionRequest | null;
  setSelectedExtensionRequest: (request: MapExtensionRequest | null) => void;
  showMaintenanceScheduleDialog: boolean;
  setShowMaintenanceScheduleDialog: (show: boolean) => void;
  showExtensionDetailsDialog: boolean;
  setShowExtensionDetailsDialog: (show: boolean) => void;
  refreshData: () => void;
  handleAddMaintenance: (vehicle: TransportVehicle) => void;
  handleViewMaintenanceDetails: (schedule: MaintenanceSchedule) => void;
  handleResolveExtension: (requestId: string, approved: boolean) => void;
  openMaintenanceScheduleDialog: (vehicle: TransportVehicle) => void;
  openExtensionDetailsDialog: (request: MapExtensionRequest) => void;
  filters: {
    status: string[];
    vehicleType: string[];
    priority: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string[];
    vehicleType: string[];
    priority: string[];
  }>>;
  availabilityDate: Date;
  setAvailabilityDate: React.Dispatch<React.SetStateAction<Date>>;
  filteredDrivers: TransportDriver[];
  isLoading: boolean;
}

const PlanningContext = createContext<PlanningContextType | null>(null);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehiclesData, setVehiclesData] = useState<TransportVehicle[]>(mockVehicles as unknown as TransportVehicle[]);
  const [maintenanceSchedulesData, setMaintenanceSchedulesData] = useState<MaintenanceSchedule[]>(
    mockMaintenanceSchedules as unknown as MaintenanceSchedule[]
  );
  const [extensionRequestsData, setExtensionRequestsData] = useState<MapExtensionRequest[]>(
    mockExtensionRequests as unknown as MapExtensionRequest[]
  );
  const [driversData, setDriversData] = useState<TransportDriver[]>(mockDrivers as unknown as TransportDriver[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [selectedMaintenanceSchedule, setSelectedMaintenanceSchedule] = useState<MaintenanceSchedule | null>(null);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<MapExtensionRequest | null>(null);

  const [showMaintenanceScheduleDialog, setShowMaintenanceScheduleDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);

  const [filters, setFilters] = useState({
    status: [],
    vehicleType: [],
    priority: [],
  });

  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  const filteredDrivers = driversData.filter(driver => 
    driver.available && driver.status !== "on_leave"
  );

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVehiclesData(mockVehicles as unknown as TransportVehicle[]);
      setMaintenanceSchedulesData(mockMaintenanceSchedules as unknown as MaintenanceSchedule[]);
      setExtensionRequestsData(mockExtensionRequests as unknown as MapExtensionRequest[]);
      setDriversData(mockDrivers as unknown as TransportDriver[]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddMaintenance = useCallback((vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceScheduleDialog(true);
  }, []);

  const handleViewMaintenanceDetails = useCallback((schedule: MaintenanceSchedule) => {
    setSelectedMaintenanceSchedule(schedule);
    setShowMaintenanceScheduleDialog(true);
  }, []);

  const handleResolveExtension = useCallback((requestId: string, approved: boolean) => {
    setExtensionRequestsData(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' } 
          : req
      )
    );
    setShowExtensionDetailsDialog(false);
  }, []);

  const openMaintenanceScheduleDialog = useCallback((vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedMaintenanceSchedule(null);
    setShowMaintenanceScheduleDialog(true);
  }, []);

  const openExtensionDetailsDialog = useCallback((request: MapExtensionRequest) => {
    setSelectedExtensionRequest(request);
    setShowExtensionDetailsDialog(true);
  }, []);

  const value = {
    vehicles: vehiclesData,
    maintenanceSchedules: maintenanceSchedulesData,
    extensionRequests: extensionRequestsData,
    drivers: driversData,
    selectedVehicle,
    setSelectedVehicle,
    selectedMaintenanceSchedule,
    setSelectedMaintenanceSchedule,
    selectedExtensionRequest,
    setSelectedExtensionRequest,
    showMaintenanceScheduleDialog,
    setShowMaintenanceScheduleDialog,
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog,
    refreshData,
    handleAddMaintenance,
    handleViewMaintenanceDetails,
    handleResolveExtension,
    openMaintenanceScheduleDialog,
    openExtensionDetailsDialog,
    filters,
    setFilters,
    availabilityDate,
    setAvailabilityDate,
    filteredDrivers,
    isLoading,
  };

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>;
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
