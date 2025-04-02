
import { TransportVehicle, TransportDriver, MaintenanceSchedule, MapExtensionRequest } from '../types';

// Mock vehicles data
export const mockVehicles: Partial<TransportVehicle>[] = [
  {
    id: "veh-001",
    name: "Mercedes Classe E",
    type: "sedan",
    licensePlate: "AB-123-CD",
    status: "available",
    lastMaintenanceDate: "2023-04-15",
    nextMaintenanceDate: "2023-07-15",
    mileage: 45230,
    capacity: 4,
    available: true,
    location: { lat: 48.8566, lng: 2.3522 },
    notes: []
  },
  {
    id: "veh-002",
    name: "Mercedes Classe V",
    type: "van",
    licensePlate: "CD-456-EF",
    status: "maintenance",
    lastMaintenanceDate: "2023-03-20",
    nextMaintenanceDate: "2023-06-20",
    mileage: 78650,
    capacity: 7,
    available: false,
    location: { lat: 48.8606, lng: 2.3376 },
    notes: []
  },
  {
    id: "veh-003",
    name: "BMW Série 5",
    type: "sedan",
    licensePlate: "EF-789-GH",
    status: "reserved",
    lastMaintenanceDate: "2023-05-05",
    nextMaintenanceDate: "2023-08-05",
    mileage: 32150,
    capacity: 4,
    available: false,
    location: { lat: 48.8744, lng: 2.3526 },
    notes: []
  },
  {
    id: "veh-004",
    name: "Tesla Model S",
    type: "electric",
    licensePlate: "GH-012-IJ",
    status: "available",
    lastMaintenanceDate: "2023-05-25",
    nextMaintenanceDate: "2023-08-25",
    mileage: 15780,
    capacity: 5,
    available: true,
    location: { lat: 48.8647, lng: 2.3407 },
    notes: []
  }
];

// Mock maintenance schedules
export const mockMaintenanceSchedules: Partial<MaintenanceSchedule>[] = [
  {
    id: "maint-001",
    vehicleId: "veh-002",
    scheduledDate: "2023-06-15",
    type: "regular",
    description: "Entretien périodique",
    estimatedDuration: 120,
    technicianAssigned: "Jean Dupont",
    status: "scheduled"
  },
  {
    id: "maint-002",
    vehicleId: "veh-001",
    scheduledDate: "2023-07-10",
    type: "inspection",
    description: "Contrôle technique obligatoire",
    estimatedDuration: 90,
    technicianAssigned: "Pierre Martin",
    status: "scheduled"
  },
  {
    id: "maint-003",
    vehicleId: "veh-004",
    scheduledDate: "2023-06-05",
    type: "repair",
    description: "Remplacement des plaquettes de frein",
    estimatedDuration: 60,
    technicianAssigned: "Sophie Dubois",
    status: "completed"
  }
];

// Mock extension requests
export const mockExtensionRequests: Partial<MapExtensionRequest>[] = [
  {
    id: "ext-001",
    reservationId: "res-001",
    vehicleId: "veh-001",
    vehicleName: "Mercedes Classe E",
    driverId: "drv-002",
    driverName: "Marie Laurent",
    requestId: "REQ-001",
    status: "pending",
    reason: "Client needs the vehicle for an extra day due to extended meeting",
    originalEndDate: "2023-06-20",
    requestedEndDate: "2023-06-21",
    clientName: "Acme Corp",
    timestamp: "2023-06-18T14:30:00"
  },
  {
    id: "ext-002",
    reservationId: "res-005",
    vehicleId: "veh-003",
    vehicleName: "BMW Série 5",
    driverId: "drv-001",
    driverName: "Jean Dupont",
    requestId: "REQ-002",
    status: "approved",
    reason: "Extended business trip",
    originalEndDate: "2023-06-25",
    requestedEndDate: "2023-06-27",
    clientName: "Global Industries",
    timestamp: "2023-06-22T09:15:00"
  },
  {
    id: "ext-003",
    reservationId: "res-008",
    vehicleId: "veh-004",
    vehicleName: "Tesla Model S",
    driverId: "drv-004",
    driverName: "Julie Leroy",
    requestId: "REQ-003",
    status: "rejected",
    reason: "Vehicle needed for another reservation",
    originalEndDate: "2023-07-02",
    requestedEndDate: "2023-07-05",
    clientName: "Tech Innovations",
    timestamp: "2023-06-28T16:45:00"
  }
];

// Mock drivers data
export const mockDrivers: Partial<TransportDriver>[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    available: true,
    onLeave: false,
    status: "active",
    experience: 5,
    rating: 4.8,
    licensesTypes: ["B", "C"]
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Laurent",
    email: "marie.laurent@example.com",
    phone: "07 23 45 67 89",
    available: false,
    onLeave: false,
    status: "driving",
    experience: 3,
    rating: 4.7,
    licensesTypes: ["B"]
  },
  {
    id: "drv-003",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@example.com",
    phone: "06 34 56 78 90",
    available: false,
    onLeave: true,
    status: "on_leave",
    experience: 7,
    rating: 4.9,
    licensesTypes: ["B", "D"]
  }
];
