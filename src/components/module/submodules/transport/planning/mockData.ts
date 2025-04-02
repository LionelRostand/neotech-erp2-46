
import { TransportVehicle, TransportDriver, VehicleMaintenanceSchedule, MapExtensionRequest } from '../types';

// Mock vehicles data
export const mockVehicles: TransportVehicle[] = [
  { 
    id: 'v1', 
    name: 'Mercedes Sprinter', 
    type: 'van', 
    licensePlate: 'AB-123-CD', 
    status: 'available',
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-08-15',
    mileage: 45000,
    capacity: 8,
    available: true,
    location: { lat: 48.8566, lng: 2.3522 }
  },
  { 
    id: 'v2', 
    name: 'Tesla Model S', 
    type: 'sedan', 
    licensePlate: 'EF-456-GH', 
    status: 'maintenance',
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-09-01',
    mileage: 32000,
    capacity: 4,
    available: false,
    location: { lat: 48.8566, lng: 2.3522 }
  },
  { 
    id: 'v3', 
    name: 'Renault Trafic', 
    type: 'van', 
    licensePlate: 'IJ-789-KL', 
    status: 'reserved',
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-07-20',
    mileage: 68000,
    capacity: 9,
    available: false,
    location: { lat: 48.8566, lng: 2.3522 }
  },
  { 
    id: 'v4', 
    name: 'BMW 5 Series', 
    type: 'sedan', 
    licensePlate: 'MN-012-OP', 
    status: 'available',
    lastMaintenanceDate: '2024-02-28',
    nextMaintenanceDate: '2024-08-28',
    mileage: 28000,
    capacity: 5,
    available: true,
    location: { lat: 48.8566, lng: 2.3522 }
  },
];

// Mock maintenance schedules
export const mockMaintenanceSchedules: VehicleMaintenanceSchedule[] = [
  {
    id: 'm1',
    vehicleId: 'v2',
    scheduledDate: '2024-04-15',
    type: 'regular',
    description: 'Entretien régulier',
    estimatedDuration: 180,
    status: 'scheduled',
    startDate: '2024-04-15T08:00:00',
    endDate: '2024-04-15T11:00:00',
    technician: 'Jean Dupont',
    notes: 'Changement de filtres et vidange'
  },
  {
    id: 'm2',
    vehicleId: 'v1',
    scheduledDate: '2024-04-22',
    type: 'repair',
    description: 'Réparation des freins',
    estimatedDuration: 240,
    status: 'scheduled',
    startDate: '2024-04-22T09:00:00',
    endDate: '2024-04-22T13:00:00',
    technician: 'Marie Martin',
    notes: 'Remplacement des plaquettes de frein avant et arrière'
  },
  {
    id: 'm3',
    vehicleId: 'v3',
    scheduledDate: '2024-05-05',
    type: 'inspection',
    description: 'Contrôle technique',
    estimatedDuration: 120,
    status: 'scheduled',
    startDate: '2024-05-05T14:00:00',
    endDate: '2024-05-05T16:00:00',
    technician: 'Thomas Bernard',
    notes: 'Contrôle technique obligatoire'
  },
];

// Mock extension requests
export const mockExtensionRequests: MapExtensionRequest[] = [
  {
    id: 'e1',
    vehicleId: 'v3',
    vehicleName: 'Renault Trafic',
    driverId: 'd2',
    driverName: 'Sophie Martin',
    status: 'pending',
    reason: 'Retard du client pour le retour',
    requestedExtension: 2,
    originalEndTime: '2024-04-15T18:00:00',
    newEndTime: '2024-04-15T20:00:00',
    timestamp: '2024-04-15T16:30:00'
  },
  {
    id: 'e2',
    vehicleId: 'v1',
    vehicleName: 'Mercedes Sprinter',
    driverId: 'd1',
    driverName: 'Pierre Dubois',
    status: 'approved',
    reason: 'Prolongation demandée par le client',
    requestedExtension: 4,
    originalEndTime: '2024-04-16T14:00:00',
    newEndTime: '2024-04-16T18:00:00',
    timestamp: '2024-04-16T10:15:00'
  },
  {
    id: 'e3',
    vehicleId: 'v4',
    vehicleName: 'BMW 5 Series',
    driverId: 'd3',
    driverName: 'Alexandre Petit',
    status: 'rejected',
    reason: 'Besoin d\'un véhicule supplémentaire',
    requestedExtension: 3,
    originalEndTime: '2024-04-17T12:00:00',
    newEndTime: '2024-04-17T15:00:00',
    timestamp: '2024-04-17T09:45:00'
  },
];

// Mock drivers data
export const mockDrivers: TransportDriver[] = [
  {
    id: 'd1',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre.dubois@example.com',
    phone: '+33 6 12 34 56 78',
    available: true,
    onLeave: false,
    experience: 5,
    licensesTypes: ['B', 'D'],
    status: 'active',
    rating: 4.8,
    skills: ['luxury', 'airport'],
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'd2',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6 23 45 67 89',
    available: true,
    onLeave: false,
    experience: 3,
    licensesTypes: ['B'],
    status: 'active',
    rating: 4.5,
    skills: ['events', 'night'],
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'd3',
    firstName: 'Alexandre',
    lastName: 'Petit',
    email: 'alex.petit@example.com',
    phone: '+33 6 34 56 78 90',
    available: false,
    onLeave: true,
    experience: 8,
    licensesTypes: ['B', 'D'],
    status: 'on_leave',
    rating: 4.9,
    skills: ['luxury', 'long-distance'],
    photo: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: 'd4',
    firstName: 'Marie',
    lastName: 'Leroy',
    email: 'marie.leroy@example.com',
    phone: '+33 6 45 67 89 01',
    available: true,
    onLeave: false,
    experience: 2,
    licensesTypes: ['B'],
    status: 'active',
    rating: 4.2,
    skills: ['airport', 'night'],
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];
