import {
  MaintenanceSchedule,
  PlanningItem,
  VehicleMaintenanceSchedule,
} from '../types/planning-types';
import { TransportVehicle } from '../types/vehicle-types';
import { MapExtensionRequest } from '../types/map-types';
import { TransportDriver } from '../types/driver-types';

export const planningItems: PlanningItem[] = [
  {
    id: 'pi-001',
    title: 'Révision Mercedes Classe E',
    vehicle: 'veh-001',
    date: '2023-12-05',
    time: '09:00',
    type: 'maintenance',
    status: 'scheduled',
  },
  {
    id: 'pi-002',
    title: 'Nettoyage Intérieur BMW Série 5',
    vehicle: 'veh-002',
    date: '2023-12-06',
    time: '14:00',
    type: 'cleaning',
    status: 'scheduled',
  },
  {
    id: 'pi-003',
    title: 'Contrôle Technique Tesla Model S',
    vehicle: 'veh-003',
    date: '2023-12-07',
    time: '10:00',
    type: 'inspection',
    status: 'in-progress',
  },
  {
    id: 'pi-004',
    title: 'Changement Pneus Mercedes Classe V',
    vehicle: 'veh-004',
    date: '2023-12-08',
    time: '11:00',
    type: 'tire-change',
    status: 'completed',
  },
];

export const vehiclesMaintenanceSchedules: VehicleMaintenanceSchedule[] = [
  {
    vehicleId: 'veh-001',
    maintenanceScheduleIds: ['ms-001', 'ms-002'],
  },
  {
    vehicleId: 'veh-002',
    maintenanceScheduleIds: ['ms-003'],
  },
];

export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "ms-001",
    vehicleId: "veh-001",
    scheduledDate: "2023-12-05",
    type: "oil-change",
    description: "Changement d'huile et filtre",
    estimatedDuration: 60,
    technicianAssigned: "Jean Dupont",
    status: "completed",
    startDate: "2023-12-05T09:00:00",
    endDate: "2023-12-05T10:00:00",
    technician: "Jean Dupont",
    completed: true,
    notes: "Réalisé dans les délais",
    taskName: "Maintenance régulière",
    priority: "medium",
    nextDue: "2024-03-05"
  },
  {
    id: "ms-002",
    vehicleId: "veh-002",
    scheduledDate: "2023-12-10",
    type: "brake-inspection",
    description: "Inspection et remplacement plaquettes de frein",
    estimatedDuration: 120,
    technicianAssigned: "Pierre Martin",
    status: "scheduled",
    startDate: "2023-12-10T14:00:00",
    endDate: "2023-12-10T16:00:00",
    technician: "Pierre Martin",
    completed: false,
    notes: "",
    taskName: "Inspection freins",
    priority: "high",
    nextDue: "2024-02-10"
  },
  {
    id: "ms-003",
    vehicleId: "veh-004",
    scheduledDate: "2023-12-15",
    type: "tire-rotation",
    description: "Rotation des pneus et vérification pression",
    estimatedDuration: 45,
    technicianAssigned: "Sophie Laurent",
    status: "scheduled",
    startDate: "2023-12-15T11:00:00",
    endDate: "2023-12-15T11:45:00",
    technician: "Sophie Laurent",
    completed: false,
    notes: "",
    taskName: "Entretien pneus",
    priority: "medium",
    nextDue: "2024-01-15"
  }
];

export const extensionRequests: MapExtensionRequest[] = [
  {
    id: 'er-001',
    requestId: 'req-001',
    type: 'traffic',
    active: true,
    clientName: 'Air France',
    vehicleName: 'Mercedes Classe E',
    originalEndDate: '2023-12-20',
    requestedEndDate: '2023-12-27',
    reason: 'Période de forte affluence',
    extensionReason: 'Prolongation de contrat',
    createdAt: '2023-11-28',
    status: 'pending',
  },
  {
    id: 'er-002',
    requestId: 'req-002',
    type: 'satellite',
    active: false,
    clientName: 'Total Energies',
    vehicleName: 'BMW Série 5',
    originalEndDate: '2023-12-15',
    requestedEndDate: '2023-12-22',
    reason: 'Suivi des interventions',
    extensionReason: 'Nécessité de suivi précis',
    createdAt: '2023-11-29',
    status: 'approved',
  },
  {
    id: 'er-003',
    requestId: 'req-003',
    type: 'terrain',
    active: true,
    clientName: 'SNCF',
    vehicleName: 'Tesla Model S',
    originalEndDate: '2023-12-10',
    requestedEndDate: '2023-12-17',
    reason: 'Amélioration de la navigation',
    extensionReason: 'Conditions météorologiques difficiles',
    createdAt: '2023-11-30',
    status: 'rejected',
  },
];

export const mockDrivers: TransportDriver[] = [
  {
    id: 'driver-001',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    licenseNumber: '123456789',
    licenseExpiry: '2024-12-31',
    status: 'active',
    rating: 4.5,
    hireDate: '2022-01-01',
  },
  {
    id: 'driver-002',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@example.com',
    phone: '0623456789',
    licenseNumber: '987654321',
    licenseExpiry: '2025-06-30',
    status: 'inactive',
    rating: 4.2,
    hireDate: '2022-03-15',
  },
  {
    id: 'driver-003',
    firstName: 'Pierre',
    lastName: 'Lefevre',
    email: 'pierre.lefevre@example.com',
    phone: '0634567890',
    licenseNumber: '456789123',
    licenseExpiry: '2024-09-30',
    status: 'on_leave',
    rating: 4.8,
    hireDate: '2022-05-01',
  },
];
