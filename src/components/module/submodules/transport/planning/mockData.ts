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

// Mock extension requests with corrected properties
export const mockExtensionRequests = [
  {
    id: "ext-001",
    requestId: "REQ-001",
    clientName: "Marie Dupont",
    vehicleName: "Mercedes S-Class",
    driverName: "Jean Martin",
    originalEndDate: "2023-11-15",
    requestedEndDate: "2023-11-16",
    originalEndTime: "18:00",
    newEndTime: "12:00",
    status: "pending",
    reason: "Client meeting extended",
    extensionReason: "Business needs",
    reservationId: "res-001",
    vehicleId: "v1"
  },
  {
    id: "ext-002",
    requestId: "REQ-002",
    clientName: "Pierre Leroy",
    vehicleName: "BMW 5 Series",
    driverName: "Sophie Dubois",
    originalEndDate: "2023-11-18",
    requestedEndDate: "2023-11-19",
    originalEndTime: "20:00",
    newEndTime: "12:00",
    status: "approved",
    reason: "Flight delay",
    extensionReason: "Travel complications",
    reservationId: "res-003",
    vehicleId: "v2"
  },
  {
    id: "ext-003",
    requestId: "REQ-003",
    clientName: "Lucas Bernard",
    vehicleName: "Tesla Model X",
    driverName: "Marc Petit",
    originalEndDate: "2023-11-20",
    requestedEndDate: "2023-11-21",
    originalEndTime: "14:00",
    newEndTime: "14:00",
    status: "rejected",
    reason: "Personal reasons",
    extensionReason: "Vehicle needed for another reservation",
    reservationId: "res-005",
    vehicleId: "v4"
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
