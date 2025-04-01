
import { TransportVehicle, MaintenanceSchedule, MapExtensionRequest, TransportDriver } from '../types';

export const vehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    licensePlate: "AB-123-CD",
    capacity: 4,
    available: true,
    status: "active",
    mileage: 24500,
    notes: [], // Changed from string to array
    createdAt: "2023-01-15",
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    licensePlate: "EF-456-GH",
    capacity: 4,
    available: false,
    status: "maintenance",
    mileage: 31200,
    notes: [], // Changed from string to array
    createdAt: "2022-11-08",
  },
  {
    id: "veh-003",
    name: "Mercedes Classe V",
    type: "van",
    licensePlate: "IJ-789-KL",
    capacity: 7,
    available: true,
    status: "active",
    mileage: 18900,
    notes: [], // Changed from string to array
    createdAt: "2023-03-20",
  },
];

export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "ms-001",
    vehicleId: "veh-002",
    description: "Changement d'huile et filtres",
    type: "maintenance",
    scheduledDate: "2023-12-12",
    estimatedDuration: 120,
    status: "scheduled",
    notes: [], // Array of notes
    technicianAssigned: true,
    technician: "Jean Dupont",
    startDate: "2023-12-12T09:00:00",
    endDate: "2023-12-12T11:00:00",
    createdAt: "2023-11-20",
  },
  {
    id: "ms-002",
    vehicleId: "veh-001",
    description: "Contrôle technique",
    type: "inspection",
    scheduledDate: "2023-12-15",
    estimatedDuration: 60,
    status: "scheduled",
    notes: [], // Array of notes
    technicianAssigned: false,
    startDate: "2023-12-15T14:00:00",
    endDate: "2023-12-15T15:00:00",
    createdAt: "2023-11-22",
  },
  {
    id: "ms-003",
    vehicleId: "veh-003",
    description: "Remplacement des freins",
    type: "repair",
    scheduledDate: "2023-12-18",
    estimatedDuration: 180,
    status: "scheduled",
    notes: [], // Array of notes
    technicianAssigned: true,
    technician: "Pierre Martin",
    startDate: "2023-12-18T10:00:00",
    endDate: "2023-12-18T13:00:00",
    createdAt: "2023-11-25",
  },
];

export const extensionRequests: MapExtensionRequest[] = [
  {
    id: "ext-001",
    driverId: "drv-001",
    reason: "Traffic exceptionnel sur l'A1",
    requestedAt: "2023-11-25T14:30:00",
    status: "pending",
    estimatedDelay: 45,
  },
  {
    id: "ext-002",
    driverId: "drv-002",
    reason: "Client retardé",
    requestedAt: "2023-11-24T11:15:00",
    status: "approved",
    estimatedDelay: 30,
  }
];

export const drivers: TransportDriver[] = [
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
    notes: [],
    createdAt: "2021-05-10",
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Martin",
    licenseNumber: "987654321",
    licenseExpiry: "2024-08-20",
    phone: "07 65 43 21 09",
    email: "marie.martin@example.com",
    status: "active",
    rating: 4.5,
    available: true,
    onLeave: false,
    experience: 3,
    language: ["French", "Spanish"],
    preferredVehicleType: ["van"],
    notes: [],
    createdAt: "2022-01-15",
  },
];
