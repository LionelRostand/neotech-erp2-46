
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MaintenanceSchedule, ExtensionRequest } from '../../types/map-types';
import { TransportVehicle } from '../../types/transport-types';

// Mock data pour les véhicules
const mockVehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
    purchaseDate: "2022-05-15",
    lastServiceDate: "2023-05-20",
    nextServiceDate: "2023-11-20",
    mileage: 25000,
    insuranceInfo: {
      provider: "AXA",
      policyNumber: "POL-12345",
      expiryDate: "2023-12-31"
    }
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    capacity: 4,
    licensePlate: "EF-456-GH",
    available: false,
    status: "maintenance",
    purchaseDate: "2021-08-10",
    lastServiceDate: "2023-07-12",
    nextServiceDate: "2024-01-12",
    mileage: 42000,
    insuranceInfo: {
      provider: "Allianz",
      policyNumber: "POL-67890",
      expiryDate: "2023-11-15"
    }
  },
  {
    id: "veh-003",
    name: "Audi A6",
    type: "sedan",
    capacity: 4,
    licensePlate: "IJ-789-KL",
    available: true,
    status: "active",
    purchaseDate: "2022-01-20",
    lastServiceDate: "2023-06-05",
    nextServiceDate: "2023-12-05",
    mileage: 35000,
    insuranceInfo: {
      provider: "Generali",
      policyNumber: "POL-45678",
      expiryDate: "2024-01-20"
    }
  }
];

// Mock data pour les maintenances planifiées
const initialMaintenances: MaintenanceSchedule[] = [
  {
    id: "maint-001",
    vehicleId: "veh-001",
    type: "regular",
    startDate: "2023-11-15",
    endDate: "2023-11-16",
    description: "Entretien régulier",
    technician: "Jean Dupont",
    notes: "Changement d'huile et des filtres",
    completed: false
  },
  {
    id: "maint-002",
    vehicleId: "veh-002",
    type: "repair",
    startDate: "2023-11-08",
    endDate: "2023-11-10",
    description: "Réparation du système de freinage",
    technician: "Auto Repair Center",
    completed: true
  }
];

// Mock data pour les demandes de prolongation
const initialExtensionRequests: ExtensionRequest[] = [
  {
    id: "ext-001",
    requestId: "req-123",
    clientName: "Sophie Laurent",
    vehicleName: "Mercedes Classe E",
    originalEndDate: "2023-11-10",
    requestedEndDate: "2023-11-12",
    reason: "Prolongation de séjour professionnel",
    status: "pending",
    createdAt: "2023-11-08"
  },
  {
    id: "ext-002",
    requestId: "req-124",
    clientName: "Pierre Martin",
    vehicleName: "BMW Série 5",
    originalEndDate: "2023-11-15",
    requestedEndDate: "2023-11-18",
    reason: "Besoin du véhicule pour un événement",
    status: "approved",
    createdAt: "2023-11-05"
  }
];

interface PlanningContextType {
  vehicles: TransportVehicle[];
  maintenanceSchedules: MaintenanceSchedule[];
  extensionRequests: ExtensionRequest[];
  isLoading: boolean;
  selectedVehicle: TransportVehicle | null;
  selectedMaintenance: MaintenanceSchedule | null;
  selectedExtensionRequest: ExtensionRequest | null;
  refreshData: () => void;
  handleAddMaintenance: (vehicle: TransportVehicle | null) => void;
  handleEditMaintenance: (maintenance: MaintenanceSchedule) => void;
  handleSaveMaintenance: (data: any) => void;
  handleResolveExtension: (id: string, approved: boolean) => void;
  setSelectedVehicle: (vehicle: TransportVehicle | null) => void;
  setSelectedMaintenance: (maintenance: MaintenanceSchedule | null) => void;
  setSelectedExtensionRequest: (request: ExtensionRequest | null) => void;
  showMaintenanceDialog: boolean;
  setShowMaintenanceDialog: (show: boolean) => void;
  showExtensionDetailsDialog: boolean;
  setShowExtensionDetailsDialog: (show: boolean) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

interface PlanningProviderProps {
  children: ReactNode;
}

export const PlanningProvider = ({ children }: PlanningProviderProps) => {
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(initialMaintenances);
  const [extensionRequests, setExtensionRequests] = useState<ExtensionRequest[]>(initialExtensionRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceSchedule | null>(null);
  const [selectedExtensionRequest, setSelectedExtensionRequest] = useState<ExtensionRequest | null>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showExtensionDetailsDialog, setShowExtensionDetailsDialog] = useState(false);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      // Dans une application réelle, cette fonction ferait un appel à une API
      console.log('Rafraîchissement des données');
      // Pour la démo, on va juste simuler en changeant quelque chose
      const updatedMaintenance = [...maintenanceSchedules];
      if (updatedMaintenance.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedMaintenance.length);
        updatedMaintenance[randomIndex] = {
          ...updatedMaintenance[randomIndex],
          lastUpdate: new Date().toISOString()
        };
        setMaintenanceSchedules(updatedMaintenance);
      }
      setIsLoading(false);
    }, 700);
  }, [maintenanceSchedules]);

  const handleAddMaintenance = useCallback((vehicle: TransportVehicle | null) => {
    setSelectedVehicle(vehicle);
    setSelectedMaintenance(null);
    setShowMaintenanceDialog(true);
  }, []);

  const handleEditMaintenance = useCallback((maintenance: MaintenanceSchedule) => {
    const vehicle = vehicles.find(v => v.id === maintenance.vehicleId);
    setSelectedVehicle(vehicle || null);
    setSelectedMaintenance(maintenance);
    setShowMaintenanceDialog(true);
  }, [vehicles]);

  const handleSaveMaintenance = useCallback((data: any) => {
    if (selectedMaintenance) {
      // Mise à jour d'une maintenance existante
      setMaintenanceSchedules(prev => 
        prev.map(item => 
          item.id === selectedMaintenance.id ? { ...item, ...data } : item
        )
      );
    } else {
      // Ajout d'une nouvelle maintenance
      const newMaintenance: MaintenanceSchedule = {
        id: `maint-${Date.now()}`,
        vehicleId: data.vehicleId,
        type: data.type,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
        description: data.description,
        technician: data.technician,
        notes: data.notes,
        completed: false
      };
      setMaintenanceSchedules(prev => [...prev, newMaintenance]);
    }
    setShowMaintenanceDialog(false);
  }, [selectedMaintenance]);

  const handleResolveExtension = useCallback((id: string, approved: boolean) => {
    setExtensionRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: approved ? 'approved' : 'rejected' } : req
      )
    );
    setShowExtensionDetailsDialog(false);
  }, []);

  const value = {
    vehicles,
    maintenanceSchedules,
    extensionRequests,
    isLoading,
    selectedVehicle,
    selectedMaintenance,
    selectedExtensionRequest,
    refreshData,
    handleAddMaintenance,
    handleEditMaintenance,
    handleSaveMaintenance,
    handleResolveExtension,
    setSelectedVehicle,
    setSelectedMaintenance,
    setSelectedExtensionRequest,
    showMaintenanceDialog,
    setShowMaintenanceDialog,
    showExtensionDetailsDialog,
    setShowExtensionDetailsDialog
  };

  return (
    <PlanningContext.Provider value={value}>
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
