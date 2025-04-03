import { addDays, addHours, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TransportVehicle } from '../types/vehicle-types';
import { TransportDriver } from '../types/driver-types';
import { TransportReservation } from '../types/reservation-types';
import { MapExtensionRequest } from '../types/map-types';

// Sample vehicles
export const mockVehicles = [
  {
    id: "v1",
    name: "Mercedes Sprinter",
    type: "van",
    licensePlate: "AB-123-CD",
    status: "active",
    available: true,
    capacity: 8,
    notes: [],
    lastServiceDate: "2023-09-15",
    nextServiceDate: "2023-12-15",
    mileage: 45000,
    purchaseDate: "2021-03-10",
    insuranceInfo: {
      provider: "AXA",
      policyNumber: "POL-12345",
      expiryDate: "2024-03-10"
    }
  },
  {
    id: "v2",
    name: "Renault Trafic",
    type: "van",
    licensePlate: "CD-456-EF",
    status: "maintenance",
    available: false,
    capacity: 9,
    notes: [
      {
        id: "n1",
        vehicleId: "v2",
        title: "Problème de freins",
        note: "Freins à vérifier lors de la maintenance",
        author: "Jean Dupont",
        createdAt: "2023-10-15T10:30:00Z"
      }
    ],
    lastServiceDate: "2023-08-20",
    nextServiceDate: "2023-11-20",
    mileage: 62000,
    purchaseDate: "2020-06-15",
    insuranceInfo: {
      provider: "Allianz",
      policyNumber: "POL-67890",
      expiryDate: "2024-06-15"
    }
  },
  {
    id: "v3",
    name: "Mercedes S-Class",
    type: "sedan",
    licensePlate: "EF-789-GH",
    status: "active",
    available: true,
    capacity: 4,
    notes: [],
    lastServiceDate: "2023-09-05",
    nextServiceDate: "2023-12-05",
    mileage: 28000,
    purchaseDate: "2022-01-20",
    insuranceInfo: {
      provider: "AXA",
      policyNumber: "POL-24680",
      expiryDate: "2024-01-20"
    }
  },
  {
    id: "v4",
    name: "BMW 7 Series",
    type: "sedan",
    licensePlate: "GH-012-IJ",
    status: "out-of-service",
    available: false,
    capacity: 4,
    notes: [
      {
        id: "n2",
        vehicleId: "v4",
        title: "Accident",
        note: "Véhicule accidenté, en attente de réparation",
        author: "Marie Durand",
        createdAt: "2023-10-10T14:15:00Z"
      }
    ],
    lastServiceDate: "2023-07-12",
    nextServiceDate: "2023-10-12",
    mileage: 35000,
    purchaseDate: "2021-11-05",
    insuranceInfo: {
      provider: "Generali",
      policyNumber: "POL-13579",
      expiryDate: "2024-11-05"
    }
  },
  {
    id: "v5",
    name: "Tesla Model Y",
    type: "suv",
    licensePlate: "VE-456-ZZ",
    status: "active",
    available: true,
    capacity: 5,
    notes: [],
    lastServiceDate: "2023-10-01",
    nextServiceDate: "2024-01-01",
    mileage: 15000,
    purchaseDate: "2023-02-15",
    insuranceInfo: {
      provider: "Maif",
      policyNumber: "POL-97531",
      expiryDate: "2024-02-15"
    }
  }
];

// Sample drivers
export const mockDrivers: TransportDriver[] = [
  {
    id: "d1",
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@example.com",
    phone: "+33612345678",
    licenseNumber: "12AB34567",
    licenseExpiry: "2025-06-30",
    status: "active",
    rating: 4.8,
    notes: [],
    address: "15 Rue de la Paix, 75001 Paris, France",
    hireDate: "2020-03-15",
    assignedVehicleId: "v1"
  },
  {
    id: "d2",
    firstName: "Sophie",
    lastName: "Dubois",
    email: "sophie.dubois@example.com",
    phone: "+33623456789",
    licenseNumber: "23CD45678",
    licenseExpiry: "2024-11-15",
    status: "driving",
    rating: 4.9,
    notes: [],
    address: "27 Avenue des Champs-Élysées, 75008 Paris, France",
    hireDate: "2019-07-10",
    assignedVehicleId: "v3"
  },
  {
    id: "d3",
    firstName: "Pierre",
    lastName: "Leroy",
    email: "pierre.leroy@example.com",
    phone: "+33634567890",
    licenseNumber: "34DE56789",
    licenseExpiry: "2026-02-28",
    status: "off-duty",
    rating: 4.7,
    notes: [],
    address: "8 Rue de Rivoli, 75004 Paris, France",
    hireDate: "2021-01-05",
    assignedVehicleId: "v5"
  }
];

// Sample reservations
export const mockReservations: TransportReservation[] = [
  {
    id: "res001",
    clientId: "c1",
    clientName: "Marie Dupont",
    vehicleId: "v3",
    driverId: "d2",
    date: "2023-11-10",
    time: "14:00",
    pickup: "15 Rue de la Paix, Paris",
    dropoff: "Charles de Gaulle Airport, Terminal 2E",
    pickupLocation: "15 Rue de la Paix, Paris",
    dropoffLocation: "Charles de Gaulle Airport, Terminal 2E",
    status: "confirmed",
    paymentStatus: "paid",
    price: 320,
    isPaid: true,
    notes: "Client VIP, préférence siège avant"
  },
  {
    id: "res002",
    clientId: "c2",
    clientName: "Pierre Dubois",
    vehicleId: "v1",
    driverId: "d1",
    date: "2023-11-15",
    time: "10:30",
    pickup: "Aéroport CDG Terminal 2E, Paris",
    dropoff: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
    pickupLocation: "Aéroport CDG Terminal 2E, Paris",
    dropoffLocation: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
    status: "pending",
    paymentStatus: "pending",
    price: 120,
    isPaid: false,
    notes: "Besoin d'un siège enfant"
  }
];

// For MapExtensionRequest, make sure the vehicleId property is valid
export const mockExtensionRequests = [
  {
    id: "ext1",
    requestId: "REQ-001",
    clientName: "Marie Dupont",
    vehicleName: "Mercedes Sprinter",
    vehicleId: "v1",
    driverName: "Jean Martin",
    originalEndDate: "2023-10-20",
    requestedEndDate: "2023-10-21",
    status: "pending",
    reason: "Client request",
    reservationId: "res001",
    timestamp: "2023-10-18T14:30:00Z",
    type: "traffic"
  },
  {
    id: "ext2",
    requestId: "REQ-002",
    clientName: "Pierre Dubois",
    vehicleName: "Tesla Model Y",
    vehicleId: "v5",
    driverName: "Pierre Leroy",
    originalEndDate: "2023-10-25",
    requestedEndDate: "2023-10-26",
    status: "approved",
    reason: "Traffic conditions",
    reservationId: "res002",
    timestamp: "2023-10-22T09:15:00Z",
    type: "satellite"
  }
];

// Generate schedule data for the next 14 days
export const generateScheduleData = () => {
  const today = new Date();
  const scheduleData = [];

  // Generate driver schedules
  for (const driver of mockDrivers) {
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Skip some days randomly to simulate days off
      if (Math.random() > 0.8 || isWeekend) continue;
      
      const startHour = 8 + Math.floor(Math.random() * 3); // Start between 8-10 AM
      const startTime = addHours(date, startHour);
      const endTime = addHours(startTime, 8 + Math.floor(Math.random() * 4)); // 8-12 hour shifts
      
      scheduleData.push({
        id: `sch-${driver.id}-${dateStr}`,
        driverId: driver.id,
        driverName: `${driver.firstName} ${driver.lastName}`,
        date: dateStr,
        startTime: format(startTime, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
        status: Math.random() > 0.9 ? 'pending' : 'confirmed',
        vehicleId: driver.assignedVehicleId,
        vehicleName: mockVehicles.find(v => v.id === driver.assignedVehicleId)?.name || 'Non assigné'
      });
    }
  }

  return scheduleData;
};

// Generate maintenance schedules
export const generateMaintenanceSchedules = () => {
  const schedules = [];
  const today = new Date();
  
  for (const vehicle of mockVehicles) {
    // Past maintenance (completed)
    schedules.push({
      id: `maint-${vehicle.id}-past`,
      vehicleId: vehicle.id,
      scheduledDate: addDays(today, -Math.floor(Math.random() * 30)).toISOString(),
      type: "oil_change",
      description: "Changement d'huile et filtres",
      estimatedDuration: 60,
      status: "completed",
      priority: "medium",
      technicianAssigned: "Pierre Durant",
      completed: true
    });
    
    // Future maintenance
    if (Math.random() > 0.3) {
      schedules.push({
        id: `maint-${vehicle.id}-future`,
        vehicleId: vehicle.id,
        scheduledDate: addDays(today, Math.floor(Math.random() * 30) + 1).toISOString(),
        type: Math.random() > 0.5 ? "inspection" : "tire_change",
        description: Math.random() > 0.5 ? "Inspection complète" : "Changement des pneus",
        estimatedDuration: 120,
        status: "scheduled",
        priority: "high",
        technicianAssigned: "Marie Lambert",
        completed: false
      });
    }
    
    // Overdue maintenance (for some vehicles)
    if (Math.random() > 0.7) {
      schedules.push({
        id: `maint-${vehicle.id}-overdue`,
        vehicleId: vehicle.id,
        scheduledDate: addDays(today, -Math.floor(Math.random() * 10) - 1).toISOString(),
        type: "brake_service",
        description: "Vérification et remplacement des plaquettes de frein",
        estimatedDuration: 90,
        status: "overdue",
        priority: "high",
        technicianAssigned: "Jean Dupont",
        completed: false
      });
    }
  }
  
  return schedules;
};

// Format date for display
export const formatDate = (date: string) => {
  return format(new Date(date), 'PP', { locale: fr });
};

// Format time for display
export const formatTime = (time: string) => {
  return format(new Date(`2000-01-01T${time}`), 'HH:mm');
};

// Export generateMaintenanceSchedules with alias mockMaintenanceSchedules for backward compatibility
export { generateMaintenanceSchedules as mockMaintenanceSchedules };
