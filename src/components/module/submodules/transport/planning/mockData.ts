
import { TransportVehicle } from '../types/vehicle-types';
import { MapExtensionRequest } from '../types/map-types';
import { MaintenanceSchedule } from '../types/vehicle-types';
import { TransportDriver } from '../types/driver-types';

export const planningItems = [
  {
    id: '1',
    title: 'Maintenance plannifiée',
    start: new Date(2023, 5, 10, 9, 0),
    end: new Date(2023, 5, 10, 17, 0),
    type: 'maintenance',
    vehicleId: 'v1',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Réservation - Jean Dupont',
    start: new Date(2023, 5, 11, 8, 30),
    end: new Date(2023, 5, 11, 12, 0),
    type: 'reservation',
    vehicleId: 'v2',
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Maintenance - Contrôle technique',
    start: new Date(2023, 5, 12, 14, 0),
    end: new Date(2023, 5, 12, 16, 30),
    type: 'maintenance',
    vehicleId: 'v3',
    status: 'scheduled'
  },
  {
    id: '4',
    title: 'Réservation - Marie Laurent',
    start: new Date(2023, 5, 13, 9, 0),
    end: new Date(2023, 5, 13, 18, 0),
    type: 'reservation',
    vehicleId: 'v1',
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Nettoyage approfondi',
    start: new Date(2023, 5, 14, 8, 0),
    end: new Date(2023, 5, 14, 11, 0),
    type: 'maintenance',
    vehicleId: 'v2',
    status: 'completed'
  },
  {
    id: '6',
    title: 'Inspection de routine',
    start: new Date(2023, 5, 15, 13, 0),
    end: new Date(2023, 5, 15, 15, 0),
    type: 'maintenance',
    vehicleId: 'v3',
    status: 'scheduled'
  },
  {
    id: '7',
    title: 'Changement de pneus',
    start: new Date(2023, 5, 16, 10, 0),
    end: new Date(2023, 5, 16, 12, 0),
    type: 'maintenance',
    vehicleId: 'v1',
    status: 'scheduled'
  }
];

export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'ms1',
    vehicleId: 'v1',
    type: 'oil-change',
    description: 'Changement d\'huile et filtre',
    scheduledDate: '2023-06-20',
    estimatedDuration: 60, // minutes
    status: 'scheduled',
    notes: [],
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z'
  },
  {
    id: 'ms2',
    vehicleId: 'v2',
    type: 'inspection',
    description: 'Inspection complète du véhicule',
    scheduledDate: '2023-06-22',
    estimatedDuration: 120, // minutes
    status: 'scheduled',
    notes: [],
    createdAt: '2023-05-16T11:30:00Z',
    updatedAt: '2023-05-16T11:30:00Z'
  },
  {
    id: 'ms3',
    vehicleId: 'v3',
    type: 'brake-service',
    description: 'Vérification et entretien des freins',
    scheduledDate: '2023-06-25',
    estimatedDuration: 90, // minutes
    status: 'scheduled',
    notes: [],
    createdAt: '2023-05-17T14:15:00Z',
    updatedAt: '2023-05-17T14:15:00Z'
  }
];

export const vehicleMaintenanceSchedules = [
  {
    vehicleId: 'v1',
    scheduleIds: ['ms1']
  },
  {
    vehicleId: 'v2',
    scheduleIds: ['ms2']
  },
  {
    vehicleId: 'v3',
    scheduleIds: ['ms3']
  }
];

export const extensionRequests: MapExtensionRequest[] = [
  {
    id: 'req1',
    requestId: 'ext-001',
    clientName: 'Entreprise ABC',
    vehicleName: 'Mercedes Sprinter',
    originalEndDate: '2023-06-15T18:00:00Z',
    requestedEndDate: '2023-06-17T18:00:00Z',
    reason: 'Prolongation du séminaire d\'entreprise',
    extensionReason: 'Besoin du véhicule pour deux jours supplémentaires',
    status: 'pending',
    createdAt: '2023-06-10T09:15:00Z'
  },
  {
    id: 'req2',
    requestId: 'ext-002',
    clientName: 'Société XYZ',
    vehicleName: 'Tesla Model X',
    originalEndDate: '2023-06-16T12:00:00Z',
    requestedEndDate: '2023-06-16T18:00:00Z',
    reason: 'Rendez-vous client supplémentaire',
    extensionReason: 'Réunion supplémentaire en fin de journée',
    status: 'approved',
    createdAt: '2023-06-11T14:30:00Z'
  }
];

export const mockDrivers: TransportDriver[] = [
  {
    id: 'driver1',
    firstName: 'Thomas',
    lastName: 'Martin',
    phone: '+33612345678',
    email: 'thomas.martin@example.com',
    licenseNumber: 'DL123456789',
    licenseExpiry: '2025-05-15',
    available: true,
    onLeave: false,
    rating: 4.8,
    experience: 5, // in years
    specializations: ['VIP', 'airport', 'long-distance'],
    language: ['french', 'english'],
    preferredVehicles: ['sedan', 'luxury'],
    status: 'active',
    notes: [],
    createdAt: '2021-03-15T10:00:00Z'
  },
  {
    id: 'driver2',
    firstName: 'Sophie',
    lastName: 'Bernard',
    phone: '+33623456789',
    email: 'sophie.bernard@example.com',
    licenseNumber: 'DL987654321',
    licenseExpiry: '2024-11-10',
    available: true,
    onLeave: false,
    rating: 4.9,
    experience: 7, // in years
    specializations: ['airport', 'events'],
    language: ['french', 'spanish', 'english'],
    preferredVehicles: ['van', 'minibus'],
    status: 'active',
    notes: [],
    createdAt: '2020-07-22T09:30:00Z'
  },
  {
    id: 'driver3',
    firstName: 'Nicolas',
    lastName: 'Petit',
    phone: '+33634567890',
    email: 'nicolas.petit@example.com',
    licenseNumber: 'DL543216789',
    licenseExpiry: '2025-02-20',
    available: false,
    onLeave: true,
    rating: 4.7,
    experience: 3, // in years
    specializations: ['airport', 'tourism'],
    language: ['french', 'english'],
    preferredVehicles: ['sedan'],
    status: 'on_leave',
    notes: [],
    createdAt: '2022-01-05T11:15:00Z'
  }
];

export const vehicles: TransportVehicle[] = [
  {
    id: "v1",
    name: "Mercedes Sprinter",
    type: "van",
    licensePlate: "AA-123-BB",
    capacity: 8,
    year: 2021,
    mileage: 45000,
    available: true,
    status: "active",
    maintenanceDate: "2023-05-15",
    nextMaintenanceDate: "2023-08-15",
    registrationDate: "2021-03-10",
    insuranceExpiryDate: "2024-03-10",
    lastInspectionDate: "2023-05-15",
    fuelType: "diesel",
    notes: [],
    createdAt: "2021-03-10T10:00:00Z",
    updatedAt: "2023-05-15T14:30:00Z"
  },
  {
    id: "v2",
    name: "Tesla Model 3",
    type: "sedan",
    licensePlate: "CC-456-DD",
    capacity: 4,
    year: 2022,
    mileage: 25000,
    available: true,
    status: "active",
    maintenanceDate: "2023-04-20",
    nextMaintenanceDate: "2023-07-20",
    registrationDate: "2022-01-15",
    insuranceExpiryDate: "2024-01-15",
    lastInspectionDate: "2023-04-20",
    fuelType: "electric",
    notes: [],
    createdAt: "2022-01-15T09:45:00Z",
    updatedAt: "2023-04-20T16:15:00Z"
  },
  {
    id: "v3",
    name: "BMW Série 5",
    type: "luxury",
    licensePlate: "EE-789-FF",
    capacity: 5,
    year: 2020,
    mileage: 65000,
    available: false,
    status: "maintenance",
    maintenanceDate: "2023-06-01",
    nextMaintenanceDate: "2023-09-01",
    registrationDate: "2020-10-05",
    insuranceExpiryDate: "2023-10-05",
    lastInspectionDate: "2023-06-01",
    fuelType: "hybrid",
    notes: [],
    createdAt: "2020-10-05T11:30:00Z",
    updatedAt: "2023-06-01T13:45:00Z"
  }
];
