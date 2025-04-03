
import {
  DriverAvailabilityPeriod,
  MapExtensionRequest,
  TransportDriver,
  TransportVehicle,
  TransportVehicleLocation,
  MaintenanceSchedule
} from '../types';

export const mockDrivers: TransportDriver[] = [
  {
    id: 'driver-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33612345678',
    address: '123 Rue de la Paix, 75001 Paris',
    licenseNumber: '1234567890',
    status: 'available', // Changed from availability to status
    available: true,      // Added available field
    vehicleId: 'vehicle-1',
    notes: [],
    schedule: [],
    rating: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: 5, // Added for DriverAvailabilityTab
  },
  {
    id: 'driver-2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    phone: '+33698765432',
    address: '456 Avenue des Champs-Élysées, 75008 Paris',
    licenseNumber: '0987654321',
    status: 'busy', // Changed from availability to status
    available: false, // Added available field
    vehicleId: 'vehicle-2',
    notes: [],
    schedule: [],
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: 8, // Added for DriverAvailabilityTab
  },
  {
    id: 'driver-3',
    firstName: 'Pierre',
    lastName: 'Lefevre',
    email: 'pierre.lefevre@example.com',
    phone: '+33655555555',
    address: '789 Rue de Rivoli, 75001 Paris',
    licenseNumber: '5555555555',
    status: 'available', // Changed from availability to status
    available: true, // Added available field
    vehicleId: 'vehicle-3',
    notes: [],
    schedule: [],
    rating: 4.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: 3, // Added for DriverAvailabilityTab
  },
  {
    id: 'driver-4',
    firstName: 'Sophie',
    lastName: 'Garcia',
    email: 'sophie.garcia@example.com',
    phone: '+33611111111',
    address: '10 Avenue Montaigne, 75008 Paris',
    licenseNumber: '1111111111',
    status: 'on_leave', // Changed from availability to status
    available: false, // Added available field
    vehicleId: 'vehicle-4',
    notes: [],
    schedule: [],
    rating: 4.9,
    onLeave: true, // Added for DriverAvailabilityTab
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: 10, // Added for DriverAvailabilityTab
  },
  {
    id: 'driver-5',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'lucas.moreau@example.com',
    phone: '+33622222222',
    address: '22 Rue du Faubourg Saint-Honoré, 75008 Paris',
    licenseNumber: '2222222222',
    status: 'available', // Changed from availability to status
    available: true, // Added available field
    vehicleId: 'vehicle-5',
    notes: [],
    schedule: [],
    rating: 4.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: 6, // Added for DriverAvailabilityTab
  },
];

export const mockVehicles: TransportVehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Mercedes Sprinter',
    type: 'Van',
    model: 'Sprinter',
    make: 'Mercedes-Benz',
    year: 2018,
    licensePlate: 'AB-123-CD',
    capacity: 8,
    status: 'available', // Changed from availability to status
    available: true, // Added available field 
    location: 'Paris',
    notes: [],
    maintenanceSchedule: [],
    incidentRecords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vehicle-2',
    name: 'BMW X5',
    type: 'SUV',
    model: 'X5',
    make: 'BMW',
    year: 2020,
    licensePlate: 'EF-456-GH',
    capacity: 5,
    status: 'maintenance', // Changed from availability to status
    available: false, // Added available field
    location: 'Lyon',
    notes: [],
    maintenanceSchedule: [],
    incidentRecords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vehicle-3',
    name: 'Renault Clio',
    type: 'Sedan',
    model: 'Clio',
    make: 'Renault',
    year: 2019,
    licensePlate: 'IJ-789-KL',
    capacity: 5,
    status: 'available', // Changed from availability to status
    available: true, // Added available field
    location: 'Marseille',
    notes: [],
    maintenanceSchedule: [],
    incidentRecords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vehicle-4',
    name: 'Peugeot 308',
    type: 'Hatchback',
    model: '308',
    make: 'Peugeot',
    year: 2021,
    licensePlate: 'MN-012-OP',
    capacity: 5,
    status: 'available', // Changed from availability to status
    available: true, // Added available field
    location: 'Toulouse',
    notes: [],
    maintenanceSchedule: [],
    incidentRecords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vehicle-5',
    name: 'Citroen C4',
    type: 'Hatchback',
    model: 'C4',
    make: 'Citroen',
    year: 2022,
    licensePlate: 'QR-345-ST',
    capacity: 5,
    status: 'available', // Changed from availability to status
    available: true, // Added available field
    location: 'Bordeaux',
    notes: [],
    maintenanceSchedule: [],
    incidentRecords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockVehicleLocations: TransportVehicleLocation[] = [
  {
    vehicleId: 'vehicle-1',
    location: {
      lat: 48.8566,
      lng: 2.3522
    },
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle-2',
    location: {
      lat: 45.7640,
      lng: 4.8357
    },
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle-3',
    location: {
      lat: 43.2965,
      lng: 5.3698
    },
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle-4',
    location: {
      lat: 43.6043,
      lng: 1.4429
    },
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle-5',
    location: {
      lat: 44.8378,
      lng: -0.5792
    },
    timestamp: new Date().toISOString(),
  },
];

export const driverSchedules = [
  {
    driverId: 'driver-1',
    startTime: '08:00',
    endTime: '17:00',
    date: '2023-08-15',
  },
  {
    driverId: 'driver-2',
    startTime: '09:00',
    endTime: '18:00',
    date: '2023-08-15',
  },
  {
    driverId: 'driver-3',
    startTime: '10:00',
    endTime: '19:00',
    date: '2023-08-15',
  },
];

export const driverAvailability: DriverAvailabilityPeriod[] = [
  {
    driverId: 'driver-1',
    startDate: '2023-08-15',
    endDate: '2023-08-20',
    availabilitySlots: [
      {
        startTime: '08:00',
        endTime: '17:00'
      }
    ]
  },
  {
    driverId: 'driver-2',
    startDate: '2023-08-15',
    endDate: '2023-08-20',
    availabilitySlots: [
      {
        startTime: '09:00',
        endTime: '18:00'
      }
    ]
  },
  {
    driverId: 'driver-3',
    startDate: '2023-08-15',
    endDate: '2023-08-20',
    availabilitySlots: [
      {
        startTime: '10:00',
        endTime: '19:00'
      }
    ]
  },
];

export const mockExtensionRequests: MapExtensionRequest[] = [
  {
    id: "ext-1",
    requestId: "req-001",
    vehicleId: "vehicle-1",
    vehicleName: "Mercedes Sprinter",
    driverId: "driver-1",
    driverName: "Jean Dupont",
    status: "pending",
    reason: "Client needs the vehicle for another two hours",
    originalEndTime: "16:00",
    newEndTime: "18:00",
    clientName: "Entreprise ABC",
    originalEndDate: "2023-08-15",
    requestedEndDate: "2023-08-15",
    extensionReason: "Meeting running longer than expected",
  },
  {
    id: "ext-2",
    requestId: "req-002",
    vehicleId: "vehicle-2",
    vehicleName: "BMW X5",
    driverId: "driver-2",
    driverName: "Marie Martin",
    status: "approved",
    reason: "Client requested a larger display for presentation",
    originalEndTime: "14:00",
    newEndTime: "14:00",
    clientName: "Société XYZ",
    originalEndDate: "2023-08-16",
    requestedEndDate: "2023-08-16",
  },
];

// Add the missing generateMaintenanceSchedules function
export const generateMaintenanceSchedules = (): MaintenanceSchedule[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);
  
  return [
    {
      id: 'maint-1',
      vehicleId: 'vehicle-1',
      scheduledDate: tomorrow.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: tomorrow.toISOString(),
      type: 'regular',
      description: 'Changement d\'huile et filtre',
      estimatedDuration: 60,
      technicianAssigned: 'Marc Dubois',
      status: 'scheduled',
      priority: 'medium',
      technician: 'Marc Dubois',
      notes: 'Prévoir remplacement des plaquettes de frein'
    },
    {
      id: 'maint-2',
      vehicleId: 'vehicle-2',
      scheduledDate: now.toISOString(),
      startDate: now.toISOString(),
      endDate: tomorrow.toISOString(),
      type: 'repair',
      description: 'Réparation de la climatisation',
      estimatedDuration: 180,
      technicianAssigned: 'Lucie Martin',
      status: 'in-progress',
      priority: 'high',
      technician: 'Lucie Martin',
      notes: 'Pièce de rechange commandée'
    },
    {
      id: 'maint-3',
      vehicleId: 'vehicle-3',
      scheduledDate: nextWeek.toISOString(),
      startDate: nextWeek.toISOString(),
      endDate: nextWeek.toISOString(),
      type: 'inspection',
      description: 'Contrôle technique annuel',
      estimatedDuration: 120,
      technicianAssigned: 'Thomas Petit',
      status: 'scheduled',
      priority: 'medium',
      technician: 'Thomas Petit',
      notes: 'Véhicule à récupérer la veille'
    },
    {
      id: 'maint-4',
      vehicleId: 'vehicle-4',
      scheduledDate: nextMonth.toISOString(),
      startDate: nextMonth.toISOString(),
      endDate: nextMonth.toISOString(),
      type: 'regular',
      description: 'Remplacement des pneus',
      estimatedDuration: 90,
      technicianAssigned: 'Amandine Robert',
      status: 'scheduled',
      priority: 'low',
      technician: 'Amandine Robert',
      notes: 'Commander 4 pneus été'
    },
    {
      id: 'maint-5',
      vehicleId: 'vehicle-5',
      scheduledDate: tomorrow.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: nextWeek.toISOString(),
      type: 'repair',
      description: 'Réparation de la carrosserie',
      estimatedDuration: 480,
      technicianAssigned: 'Vincent Bernard',
      status: 'scheduled',
      priority: 'medium',
      technician: 'Vincent Bernard',
      notes: 'Dommage côté conducteur suite à un accrochage'
    }
  ];
};
