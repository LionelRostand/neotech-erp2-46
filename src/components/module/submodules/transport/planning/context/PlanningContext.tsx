
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  TransportVehicle, 
  MaintenanceSchedule,
  MapExtensionRequest,
  TransportDriver
} from '../../types/transport-types';
import { 
  mockDrivers, 
  vehicles as mockVehicles, 
  maintenanceSchedules, 
  extensionRequests 
} from '../mockData';

interface PlanningContextType {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: MapExtensionRequest[];
  drivers: TransportDriver[];
  selectedVehicleId: string | null;
  selectedDriverId: string | null;
  selectedDate: Date;
  setVehicles: (vehicles: TransportVehicle[]) => void;
  setMaintenanceSchedules: (schedules: MaintenanceSchedule[]) => void;
  setExtensionRequests: (requests: MapExtensionRequest[]) => void;
  setDrivers: (drivers: TransportDriver[]) => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSelectedDriverId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
  approveExtensionRequest: (id: string) => void;
  rejectExtensionRequest: (id: string) => void;
  deleteExtensionRequest: (id: string) => void;
}

interface PlanningProviderProps {
  children: ReactNode;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider = ({ children }: PlanningProviderProps) => {
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(maintenanceSchedules);
  const [extensionRequests, setExtensionRequests] = useState<MapExtensionRequest[]>(extensionRequests);
  
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
        setVehicles,
        setMaintenanceSchedules,
        setExtensionRequests,
        setDrivers,
        setSelectedVehicleId,
        setSelectedDriverId,
        setSelectedDate,
        approveExtensionRequest,
        rejectExtensionRequest,
        deleteExtensionRequest,
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
