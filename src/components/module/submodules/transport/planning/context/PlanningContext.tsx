
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TransportVehicle, TransportDriver, MaintenanceSchedule, MapExtensionRequest } from '../../types';
import { useToast } from '@/hooks/use-toast';

// Mock data for planning
const mockVehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
    notes: []
  },
  // More mock vehicles...
];

const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    licenseNumber: "123456789",
    licenseExpiry: "2025-06-15",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
    status: "active",
    rating: 4.8,
    available: true,
    onLeave: false,
    experience: 4,
    language: ["French", "English"],
    preferredVehicleType: ["sedan"],
    notes: []
  },
  // More mock drivers...
];

const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "maint-001",
    vehicleId: "veh-002",
    type: "oil-change",
    description: "Changement d'huile planifié",
    scheduledDate: "2023-12-15",
    estimatedDuration: 120,
    status: "scheduled",
    notes: [],
    technician: "Paul Dupuis",
    technicianAssigned: true,
    createdAt: "2023-11-20T10:00:00Z"
  },
  // More mock maintenance schedules...
];

const mockExtensionRequests: MapExtensionRequest[] = [
  {
    id: "ext-001",
    driverId: "drv-001",
    reason: "Traffic exceptionnel sur l'A1",
    requestedAt: "2023-11-25T14:30:00Z",
    status: "pending",
    estimatedDelay: 45
  },
  // More mock extension requests...
];

export interface PlanningContextType {
  isLoading: boolean;
  vehicles: TransportVehicle[];
  drivers: TransportDriver[];
  selectedVehicle: TransportVehicle | null;
  selectedExtensionRequest: MapExtensionRequest | null;
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: MapExtensionRequest[];
  refreshData: () => void;
  openMaintenanceScheduleDialog: (vehicle: TransportVehicle) => void;
  openExtensionDetailsDialog: (request: MapExtensionRequest) => void;
  showMaintenanceDialog: boolean;
  setShowMaintenanceDialog: (show: boolean) => void;
  showExtensionDetailsDialog: boolean;
  setShowExtensionDetailsDialog: (show: boolean) => void;
  handleSaveMaintenance: (maintenanceData: Partial<MaintenanceSchedule>) => void;
  handleAddMaintenance: (vehicleId: string) => void;
  handleResolveExtension: (requestId: string, approved: boolean, notes?: string) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const usePlanningContext = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanningContext must be used within a PlanningProvider');
  }
  return context;
};

// Alias for components that were using usePlanning
export const usePlanning = usePlanningContext;

interface PlanningProviderProps {
  children: ReactNode;
}

export const PlanningProvider: React.FC<PlanningProviderProps> = ({ children }) => {
  // Define state variables
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [drivers, setDrivers] = useState<TransportDriver[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [extensionRequests, setExtensionRequests] = useState<MapExtensionRequest[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<MapExtensionRequest | null>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);
  
  const { toast } = useToast();

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be API calls
      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
      setMaintenanceSchedules(mockMaintenanceSchedules);
      setExtensionRequests(mockExtensionRequests);
      
      // Filter available drivers
      const availableDrivers = mockDrivers.filter(
        driver => driver.available && driver.status !== "off-duty"
      );
      
    } catch (error) {
      console.error("Error loading planning data:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données de planification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshData = () => {
    loadData();
  };
  
  // Handle maintenance schedule dialog
  const openMaintenanceScheduleDialog = (vehicle: TransportVehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceDialog(true);
  };
  
  // Handle extension details dialog
  const openExtensionDetailsDialog = (request: MapExtensionRequest) => {
    setSelectedExtensionRequest(request);
    setShowExtensionDetailsDialog(true);
  };
  
  // Handle save maintenance
  const handleSaveMaintenance = (maintenanceData: Partial<MaintenanceSchedule>) => {
    // In a real app, this would be an API call
    const newMaintenance = {
      id: `maint-${Date.now()}`,
      vehicleId: selectedVehicle?.id || '',
      type: maintenanceData.type || 'regular',
      description: maintenanceData.description || '',
      scheduledDate: maintenanceData.scheduledDate || new Date().toISOString(),
      estimatedDuration: maintenanceData.estimatedDuration || 60,
      status: maintenanceData.status || 'scheduled',
      notes: maintenanceData.notes || [],
      createdAt: new Date().toISOString()
    };
    
    setMaintenanceSchedules(prev => [...prev, newMaintenance as MaintenanceSchedule]);
    
    toast({
      title: "Maintenance programmée",
      description: `Maintenance programmée pour le véhicule ${selectedVehicle?.name}`,
    });
    
    setShowMaintenanceDialog(false);
  };
  
  // Handle add maintenance
  const handleAddMaintenance = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      openMaintenanceScheduleDialog(vehicle);
    }
  };
  
  // Handle resolve extension request
  const handleResolveExtension = (requestId: string, approved: boolean, notes?: string) => {
    setExtensionRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' } 
          : req
      )
    );
    
    toast({
      title: approved ? "Demande approuvée" : "Demande refusée",
      description: `La demande d'extension a été ${approved ? 'approuvée' : 'refusée'}.`,
    });
    
    setShowExtensionDetailsDialog(false);
  };
  
  const value = {
    isLoading,
    vehicles,
    drivers,
    selectedVehicle,
    selectedExtensionRequest,
    maintenanceSchedules,
    extensionRequests,
    refreshData,
    openMaintenanceScheduleDialog,
    openExtensionDetailsDialog,
    showMaintenanceDialog,
    setShowMaintenanceDialog,
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog,
    handleSaveMaintenance,
    handleAddMaintenance,
    handleResolveExtension
  };
  
  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
};
