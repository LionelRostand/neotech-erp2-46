
import { TransportVehicle, TransportDriver } from '../types';
import { VehicleMaintenanceSchedule as MaintenanceSchedule, MapExtensionRequest as ExtensionRequest } from '../types';

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
    purchaseDate: "2022-05-15",
    make: "Mercedes",
    model: "Classe E",
    year: 2022,
    vinNumber: "WMEEJ8AA3FK792135",
    mileage: 25000,
    fuelType: "Diesel",
    fuelLevel: 0.75,
    createdAt: "2022-05-01"
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
    make: "BMW",
    model: "Série 5",
    year: 2021,
    vinNumber: "WBKJD4C51BE778564",
    mileage: 42000,
    fuelType: "Essence",
    fuelLevel: 0.3,
    createdAt: "2021-08-01"
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
    make: "Audi",
    model: "A6",
    year: 2022,
    vinNumber: "WAUZZZ4G1EN042620",
    mileage: 18000,
    fuelType: "Hybride",
    fuelLevel: 0.85,
    createdAt: "2022-01-10"
  },
  {
    id: "veh-004",
    name: "Mercedes Classe V",
    type: "van",
    capacity: 7,
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
    purchaseDate: "2021-11-05",
    make: "Mercedes",
    model: "Classe V",
    year: 2021,
    vinNumber: "WDD2130841A965689",
    mileage: 32000,
    fuelType: "Diesel",
    fuelLevel: 0.6,
    createdAt: "2021-11-01"
  },
  {
    id: "veh-005",
    name: "Tesla Model S",
    type: "luxury",
    capacity: 4,
    licensePlate: "QR-345-ST",
    available: false,
    status: "out-of-service",
    purchaseDate: "2022-03-15",
    make: "Tesla",
    model: "Model S",
    year: 2022,
    vinNumber: "5YJSA1E40FF119841",
    mileage: 15000,
    fuelType: "Électrique",
    fuelLevel: 0.2,
    createdAt: "2022-03-01"
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
    taskName: "Maintenance régulière",
    nextDue: "2024-05-20",
    priority: "medium",
    completed: false,
    scheduledDate: "2023-11-20",
    estimatedDuration: 120,
    status: "scheduled",
    technicianAssigned: "Garage Central"
  },
  {
    id: "mnt-002",
    vehicleId: "veh-005",
    startDate: "2023-11-15",
    endDate: "2023-11-25",
    type: "repair",
    description: "Réparation système électrique",
    technician: "ElectroCar",
    taskName: "Réparation",
    nextDue: "2024-05-15",
    priority: "high",
    completed: false,
    scheduledDate: "2023-11-15",
    estimatedDuration: 240,
    status: "in-progress",
    technicianAssigned: "ElectroCar"
  },
  {
    id: "mnt-003",
    vehicleId: "veh-001",
    startDate: "2023-12-05",
    endDate: "2023-12-06",
    type: "inspection",
    description: "Contrôle technique annuel",
    technician: "Contrôle Auto",
    taskName: "Contrôle technique",
    nextDue: "2024-12-05",
    priority: "low",
    completed: false,
    scheduledDate: "2023-12-05",
    estimatedDuration: 60,
    status: "scheduled",
    technicianAssigned: "Contrôle Auto"
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
    requestDate: "2023-11-18",
    requestedAt: "2023-11-18",
    extraTimeMinutes: 48 * 60, // 48 hours in minutes
    additionalTime: 48 * 60, // 48 hours in minutes
    extensionReason: "Prolongation voyage d'affaires",
    extensionDays: 2,
    vehicleId: "veh-002",
    driverId: "drv-002",
    driverName: "Marie Martin",
    requestedExtension: 48, // 48 hours
    originalEndTime: "2023-11-21T18:00:00",
    newEndTime: "2023-11-23T18:00:00",
    timestamp: "2023-11-18T10:30:00"
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
    requestDate: "2023-11-17",
    requestedAt: "2023-11-17",
    extraTimeMinutes: 48 * 60, // 48 hours in minutes
    additionalTime: 48 * 60, // 48 hours in minutes
    extensionReason: "Besoin supplémentaire du véhicule",
    extensionDays: 2,
    vehicleId: "veh-004",
    driverId: "drv-001",
    driverName: "Jean Dupont",
    requestedExtension: 48, // 48 hours
    originalEndTime: "2023-11-20T16:00:00",
    newEndTime: "2023-11-22T16:00:00",
    timestamp: "2023-11-17T14:15:00"
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
    status: "active",
    licenseType: "B",
    hireDate: "2019-03-10",
    createdAt: "2019-03-01"
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
    status: "driving",
    licenseType: "B",
    hireDate: "2020-01-15",
    createdAt: "2020-01-01"
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
    status: "on-leave",
    licenseType: "D",
    hireDate: "2018-06-22",
    createdAt: "2018-06-01"
  }
];
