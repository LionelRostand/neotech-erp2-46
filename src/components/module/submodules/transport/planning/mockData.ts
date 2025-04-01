
import { TransportVehicle, TransportDriver, MaintenanceSchedule, MapExtensionRequest } from '../types';

// Mock Vehicles
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

// Mock Maintenance Schedules
export const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "ms-001",
    vehicleId: "veh-001",
    type: "oil-change",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    status: "scheduled",
    notes: "Routine oil change and filter replacement",
    estimatedCost: 280,
    priority: "normal",
    assignedTo: "Garage Central"
  },
  {
    id: "ms-002",
    vehicleId: "veh-002",
    type: "major-service",
    startDate: "2023-11-10",
    endDate: "2023-11-15",
    status: "in-progress",
    notes: "Brake system overhaul and general inspection",
    estimatedCost: 950,
    priority: "high",
    assignedTo: "Garage Express"
  },
  {
    id: "ms-003",
    vehicleId: "veh-003",
    type: "inspection",
    startDate: "2023-12-05",
    endDate: "2023-12-05",
    status: "scheduled",
    notes: "Annual technical inspection",
    estimatedCost: 120,
    priority: "normal",
    assignedTo: "Contrôle Auto"
  }
];

// Mock Extension Requests
export const mockExtensionRequests: MapExtensionRequest[] = [
  {
    id: "ext-001",
    requestId: "req-001",
    type: "satellite",
    active: false,
    status: "pending",
    clientName: "Marie Martin",
    vehicleName: "Mercedes Classe E",
    originalEndDate: "2023-11-15",
    requestedEndDate: "2023-11-18",
    reason: "Client needs extended service for business meetings",
    createdAt: "2023-11-10T09:45:00",
    config: {
      resolution: "high",
      provider: "mapbox"
    }
  },
  {
    id: "ext-002",
    requestId: "req-002",
    type: "traffic",
    active: true,
    status: "approved",
    clientName: "Jean Dupont",
    vehicleName: "Audi A6",
    originalEndDate: "2023-11-22",
    requestedEndDate: "2023-11-25",
    reason: "Extended family visit",
    createdAt: "2023-11-18T14:30:00",
    config: {
      updateInterval: 300,
      includeIncidents: true
    }
  }
];

// Mock Drivers
export const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    licenseNumber: "123456789",
    licenseType: "B",
    licenseExpiry: "2025-06-15",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
    address: "15 rue des Lilas, 75001 Paris",
    status: "active",
    rating: 4.8,
    hireDate: "2019-03-10",
    preferredVehicleType: "sedan",
    available: true,
    experience: 4,
    photo: "/assets/drivers/driver1.jpg"
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Laurent",
    licenseNumber: "987654321",
    licenseType: "B",
    licenseExpiry: "2024-11-30",
    phone: "07 98 76 54 32",
    email: "marie.laurent@example.com",
    address: "8 avenue Victor Hugo, 75016 Paris",
    status: "driving",
    rating: 4.5,
    hireDate: "2020-01-15",
    preferredVehicleType: "van",
    available: false,
    experience: 3,
    photo: "/assets/drivers/driver2.jpg"
  },
  {
    id: "drv-003",
    firstName: "Pierre",
    lastName: "Martin",
    licenseNumber: "456789123",
    licenseType: "D",
    licenseExpiry: "2023-12-25",
    phone: "06 45 67 89 12",
    email: "pierre.martin@example.com",
    address: "22 rue de la République, 69002 Lyon",
    status: "off-duty",
    rating: 4.2,
    hireDate: "2018-06-22",
    preferredVehicleType: "bus",
    available: false,
    experience: 5,
    photo: "/assets/drivers/driver3.jpg"
  },
  {
    id: "drv-004",
    firstName: "Sophie",
    lastName: "Moreau",
    licenseNumber: "321654987",
    licenseType: "B",
    licenseExpiry: "2024-08-10",
    phone: "07 32 16 54 98",
    email: "sophie.moreau@example.com",
    address: "5 rue des Pyrénées, 31000 Toulouse",
    status: "active",
    rating: 4.9,
    hireDate: "2021-02-05",
    preferredVehicleType: "luxury",
    available: true,
    experience: 2,
    photo: "/assets/drivers/driver4.jpg"
  },
  {
    id: "drv-005",
    firstName: "Thomas",
    lastName: "Bernard",
    licenseNumber: "789123456",
    licenseType: "B+E",
    licenseExpiry: "2025-01-20",
    phone: "06 78 91 23 45",
    email: "thomas.bernard@example.com",
    address: "12 boulevard de la Mer, 06000 Nice",
    status: "on_leave", // Fixed from "on-leave" to "on_leave"
    rating: 4.7,
    hireDate: "2019-11-18",
    preferredVehicleType: "sedan",
    available: false,
    experience: 3,
    photo: "/assets/drivers/driver5.jpg"
  }
];
