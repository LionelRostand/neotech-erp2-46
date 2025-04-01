import { TransportVehicle } from '../types';

export const mockVehicles = [
  {
    id: "1",
    name: "Mercedes E-Class",
    licensePlate: "AB-123-CD",
    vehicleType: "sedan",
    capacity: 4,
    make: "Mercedes-Benz",
    model: "E300",
    year: 2023,
    mileage: 15000,
    status: "active", // Changed from "available" to "active"
    lastMaintenanceDate: "2023-05-15",
    nextMaintenanceDate: "2023-08-15",
    createdAt: "2023-01-10",
    notes: [], // Initialize as empty array
    active: true,
    // ... other required properties
  },
  {
    id: "2",
    name: "Tesla Model S",
    licensePlate: "EF-456-GH",
    vehicleType: "luxury",
    capacity: 5,
    make: "Tesla",
    model: "Model S",
    year: 2023,
    mileage: 8500,
    status: "active", // Changed from "available" to "active"
    lastMaintenanceDate: "2023-06-01",
    nextMaintenanceDate: "2023-09-01",
    createdAt: "2023-02-15",
    notes: [], // Initialize as empty array
    active: true,
    // ... other required properties
  },
  {
    id: "3",
    name: "Toyota Sienna",
    licensePlate: "IJ-789-KL",
    vehicleType: "van",
    capacity: 7,
    make: "Toyota",
    model: "Sienna",
    year: 2022,
    mileage: 25000,
    status: "active", // Changed from "available" to "active"
    lastMaintenanceDate: "2023-04-20",
    nextMaintenanceDate: "2023-07-20",
    createdAt: "2023-01-05",
    notes: [], // Initialize as empty array
    active: true,
    // ... other required properties
  },
  {
    id: "4",
    name: "Ford Transit",
    licensePlate: "MN-012-OP",
    vehicleType: "minibus",
    capacity: 14,
    make: "Ford",
    model: "Transit",
    year: 2021,
    mileage: 42000,
    status: "active", // Changed from "available" to "active"
    lastMaintenanceDate: "2023-05-05",
    nextMaintenanceDate: "2023-08-05",
    createdAt: "2022-11-15",
    notes: [], // Initialize as empty array
    active: true,
    // ... other required properties
  }
];

export const mockMaintenanceSchedules = [
  {
    id: "ms1",
    vehicleId: "1",
    scheduledDate: "2023-07-15",
    estimatedDuration: 4,
    maintenanceType: "oil_change",
    status: "scheduled",
    description: "Regular oil change and filter replacement",
    createdAt: "2023-06-01",
    assignedTo: "Mechanic A",
    notes: "", // Changed from empty array to empty string
    // ... other required properties
  },
  {
    id: "ms2",
    vehicleId: "2",
    scheduledDate: "2023-07-25",
    estimatedDuration: 8,
    maintenanceType: "major_service",
    status: "scheduled",
    description: "Annual service including brake check and fluid replacement",
    createdAt: "2023-06-10",
    assignedTo: "Mechanic B",
    notes: "", // Changed from empty array to empty string
    // ... other required properties
  }
];

export const mockExtensionRequests = [
  {
    id: "req1",
    requestDate: "2023-06-10",
    requestedBy: "Driver A",
    requestType: "location_extension",
    status: "pending",
    reason: "Customer requested additional stop",
    approvedBy: "",
    approvedDate: "",
    // vehicleId field removed
    // ... other required properties
  },
  {
    id: "req2",
    requestDate: "2023-06-12",
    requestedBy: "Driver B",
    requestType: "time_extension",
    status: "approved",
    reason: "Traffic delay due to accident",
    approvedBy: "Supervisor A",
    approvedDate: "2023-06-12",
    // vehicleId field removed
    // ... other required properties
  }
];

export const mockDrivers = [
  {
    id: "d1",
    firstName: "Jean",
    lastName: "Dupont",
    phone: "+33612345678",
    email: "jean.dupont@example.com",
    licenseNumber: "12345678",
    licenseType: "B",
    licenseExpiry: "2025-06-15",
    available: true,
    onLeave: false,
    rating: 4.8,
    experience: 5,
    language: ["French", "English"],
    preferredVehicleType: ["sedan", "luxury"],
    status: "active",
    notes: [],
    photo: "/avatars/driver-1.jpg",
    skills: ["night-driving", "vip-service"],
    performance: {
      completedTrips: 342,
      averageRating: 4.8,
      onTimePercentage: 97,
      satisfactionScore: 4.7
    }
  },
  {
    id: "d2",
    firstName: "Marie",
    lastName: "Laurent",
    phone: "+33623456789",
    email: "marie.laurent@example.com",
    licenseNumber: "87654321",
    licenseType: "D",
    licenseExpiry: "2024-11-20",
    available: true,
    onLeave: false,
    rating: 4.9,
    experience: 8,
    language: ["French", "Spanish", "English"],
    preferredVehicleType: ["van", "minibus"],
    status: "active",
    notes: [],
    photo: "/avatars/driver-2.jpg",
    skills: ["group-transport", "tourism"],
    performance: {
      completedTrips: 512,
      averageRating: 4.9,
      onTimePercentage: 99,
      satisfactionScore: 4.9
    }
  }
];

export const mockDriverSchedules = [
  {
    id: "ds1",
    driverId: "d1",
    date: "2023-07-15",
    startTime: "08:00",
    endTime: "16:00",
    reservationId: "r1",
    type: "reservation",
    createdAt: "2023-06-01"
  },
  {
    id: "ds2",
    driverId: "d1",
    date: "2023-07-16",
    startTime: "09:00",
    endTime: "17:00",
    reservationId: "r2",
    type: "reservation",
    createdAt: "2023-06-02"
  },
  {
    id: "ds3",
    driverId: "d2",
    date: "2023-07-15",
    startTime: "07:00",
    endTime: "15:00",
    reservationId: "r3",
    type: "reservation",
    createdAt: "2023-06-03"
  },
  {
    id: "ds4",
    driverId: "d2",
    date: "2023-07-17",
    startTime: "10:00",
    endTime: "18:00",
    type: "off-duty",
    notes: "Personal appointment",
    createdAt: "2023-06-05"
  }
];

export const mockDriverAvailability = [
  {
    id: "da1",
    driverId: "d1",
    startDate: "2023-07-20",
    endDate: "2023-07-25",
    type: "vacation",
    reason: "Annual leave",
    createdAt: "2023-06-10"
  },
  {
    id: "da2",
    driverId: "d2",
    startDate: "2023-08-01",
    endDate: "2023-08-03",
    type: "unavailable",
    reason: "Training",
    createdAt: "2023-06-15"
  }
];
