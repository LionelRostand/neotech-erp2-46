
import { TransportVehicle, TransportDriver, VehicleMaintenanceSchedule as MaintenanceSchedule, MapExtensionRequest as ExtensionRequest } from '../types';

// Mock vehicle data
export const mockVehicles: TransportVehicle[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: true,
    status: "active",
  },
  {
    id: "veh-002",
    name: "BMW Série 5",
    type: "sedan",
    capacity: 4,
    licensePlate: "EF-456-GH",
    available: false,
    status: "maintenance",
  },
  {
    id: "veh-003",
    name: "Audi A6",
    type: "sedan",
    capacity: 4,
    licensePlate: "IJ-789-KL",
    available: true,
    status: "active",
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    capacity: 7,
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
  },
  {
    id: "veh-005",
    name: "Tesla Model S",
    type: "luxury",
    capacity: 4,
    licensePlate: "QR-345-ST",
    available: false,
    status: "out-of-service",
  }
];

// Mock maintenance schedules
export const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "mnt-001",
    vehicleId: "veh-002",
    startDate: "2023-11-20",
    endDate: "2023-11-22",
    type: "regular",
    description: "Changement d'huile et filtres",
    technician: "Garage Central",
    notes: "Inclure vérification des freins",
    taskName: "Maintenance régulière",
    nextDue: "2024-05-20",
    priority: "medium"
  },
  {
    id: "mnt-002",
    vehicleId: "veh-005",
    startDate: "2023-11-15",
    endDate: "2023-11-25",
    type: "repair",
    description: "Réparation système électrique",
    technician: "ElectroCar",
    notes: "Problème de batterie détecté lors de la dernière location",
    taskName: "Réparation",
    nextDue: "2024-05-15",
    priority: "high"
  },
  {
    id: "mnt-003",
    vehicleId: "veh-001",
    startDate: "2023-12-05",
    endDate: "2023-12-06",
    type: "inspection",
    description: "Contrôle technique annuel",
    technician: "Contrôle Auto",
    notes: "Rendez-vous à 9h",
    taskName: "Contrôle technique",
    nextDue: "2024-12-05",
    priority: "low"
  }
];

// Mock extension requests
export const mockExtensionRequests: ExtensionRequest[] = [
  {
    id: "ext-001",
    reservationId: "res-001",
    requestId: "TR-2023-002",
    clientName: "Marie Legrand",
    originalEndDate: "2023-11-21",
    requestedEndDate: "2023-11-23",
    vehicleName: "BMW Série 5",
    status: "pending",
    reason: "Prolongation voyage d'affaires",
    createdAt: "2023-11-18",
    requestedBy: "Marie Legrand",
    requestedAt: "2023-11-18",
    additionalTime: 48 * 60 // 48 hours in minutes
  },
  {
    id: "ext-002",
    reservationId: "res-002",
    requestId: "TR-2023-004",
    clientName: "Sophie Bernard",
    originalEndDate: "2023-11-20",
    requestedEndDate: "2023-11-22",
    vehicleName: "Mercedes Classe V",
    status: "approved",
    reason: "Besoin supplémentaire du véhicule",
    createdAt: "2023-11-17",
    requestedBy: "Sophie Bernard",
    requestedAt: "2023-11-17",
    additionalTime: 48 * 60 // 48 hours in minutes
  }
];

// Mock drivers data
export const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
    licenseNumber: "123456789",
    licenseExpiry: "2025-06-15",
    available: true,
    onLeave: false,
    rating: 4.8,
    experience: 5,
    photo: "",
    skills: ["luxury", "airport", "events"],
    preferredVehicleTypes: ["sedan", "luxury"],
    status: "active"
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Martin",
    phone: "06 98 76 54 32",
    email: "marie.martin@example.com",
    licenseNumber: "987654321",
    licenseExpiry: "2024-03-20",
    available: false,
    onLeave: false,
    rating: 4.5,
    experience: 3,
    photo: "",
    skills: ["airport", "long-distance"],
    preferredVehicleTypes: ["sedan"],
    status: "driving"
  },
  {
    id: "drv-003",
    firstName: "Paul",
    lastName: "Lefebvre",
    phone: "07 12 34 56 78",
    email: "paul.lefebvre@example.com",
    licenseNumber: "456789123",
    licenseExpiry: "2026-09-10",
    available: true,
    onLeave: true,
    rating: 4.9,
    experience: 7,
    photo: "",
    skills: ["luxury", "events", "night"],
    preferredVehicleTypes: ["luxury"],
    status: "on-leave"
  }
];
