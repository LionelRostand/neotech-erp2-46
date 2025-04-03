
import { TransportVehicle, TransportDriver, MapExtensionRequest } from '../types';
import { addDays, format } from 'date-fns';

// Generate random dates for maintenance schedules
const generateRandomDate = (start: Date, days: number) => {
  return new Date(start.getTime() + Math.random() * days * 24 * 60 * 60 * 1000);
};

// Generate maintenance schedules
export const generateMaintenanceSchedules = () => {
  const today = new Date();
  const schedules = [];
  
  for (let i = 0; i < 5; i++) {
    const startDate = generateRandomDate(today, 30);
    const endDate = new Date(startDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
    
    schedules.push({
      id: `maint-${i + 1}`,
      vehicleId: `v-${i + 1}`,
      type: ['regular', 'repair', 'inspection'][Math.floor(Math.random() * 3)],
      description: `Maintenance for vehicle ${i + 1}`,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      status: ['scheduled', 'in-progress', 'completed'][Math.floor(Math.random() * 3)],
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      notes: `Notes for maintenance ${i + 1}`,
      technician: `Tech ${i + 1}`,
      cost: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return schedules;
};

// Mock vehicles
export const mockVehicles = [
  {
    id: 'v-1',
    name: 'Sedan 1',
    model: 'Tesla Model 3',
    type: 'sedan',
    licensePlate: 'AB-123-CD',
    color: 'white',
    status: 'active',
    currentMileage: 35000,
    year: 2021,
    lastMaintenanceDate: '2023-01-15',
    nextMaintenanceDate: '2023-07-15',
    insuranceExpiryDate: '2024-03-20',
    registrationExpiryDate: '2024-05-10',
    capacity: 4,
    fuelType: 'electric',
    notes: []
  },
  {
    id: 'v-2',
    name: 'SUV 1',
    model: 'Audi Q5',
    type: 'suv',
    licensePlate: 'EF-456-GH',
    color: 'black',
    status: 'maintenance',
    currentMileage: 48000,
    year: 2020,
    lastMaintenanceDate: '2022-11-30',
    nextMaintenanceDate: '2023-05-30',
    insuranceExpiryDate: '2024-01-25',
    registrationExpiryDate: '2024-02-15',
    capacity: 5,
    fuelType: 'diesel',
    notes: []
  }
];

// Mock drivers with required fields
export const mockDrivers: TransportDriver[] = [
  {
    id: "drv-001",
    firstName: "Jean",
    lastName: "Dupont",
    licenseNumber: "123456789",
    licenseExpiry: "2025-06-15",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
    address: "15 rue des Lilas, 75001 Paris",
    status: "active",
    rating: 4.8,
    hireDate: "2019-03-10",
    preferredVehicleType: ["sedan"],
    available: true,
    onLeave: false,
    experience: 4,
    photo: "/assets/drivers/driver1.jpg",
    language: ["French", "English"],
    notes: [],
    licensesTypes: ["B"]
  },
  {
    id: "drv-002",
    firstName: "Marie",
    lastName: "Laurent",
    licenseNumber: "987654321",
    licenseExpiry: "2024-11-30",
    phone: "07 98 76 54 32",
    email: "marie.laurent@example.com",
    address: "8 avenue Victor Hugo, 75016 Paris",
    status: "driving",
    rating: 4.5,
    hireDate: "2020-01-15",
    preferredVehicleType: ["van"],
    available: false,
    onLeave: false,
    experience: 3,
    photo: "/assets/drivers/driver2.jpg",
    language: ["French"],
    notes: [],
    licensesTypes: ["B"]
  },
  {
    id: "drv-003",
    firstName: "Thomas",
    lastName: "Bernard",
    licenseNumber: "789123456",
    licenseExpiry: "2025-01-20",
    phone: "06 78 91 23 45",
    email: "thomas.bernard@example.com",
    address: "12 boulevard de la Mer, 06000 Nice",
    status: "off-duty",
    rating: 4.7,
    hireDate: "2019-11-18",
    preferredVehicleType: ["sedan"],
    available: false,
    onLeave: false,
    experience: 3,
    photo: "/assets/drivers/driver5.jpg",
    language: ["French", "Italian"],
    notes: [],
    licensesTypes: ["B", "BE"]
  }
];

// Mock extension requests
export const mockExtensionRequests: MapExtensionRequest[] = [
  {
    id: "ext-001",
    extended: true,
    fullscreen: false,
    status: 'pending',
    clientName: 'Société Martins',
    vehicleName: 'Tesla Model 3',
    driverName: 'Jean Dupont',
    reason: 'Client needs additional time for meeting',
    originalEndTime: '14:30',
    newEndTime: '16:00',
    originalEndDate: '2023-05-20',
    requestedEndDate: '2023-05-20',
    extensionReason: 'Meeting running longer than expected'
  },
  {
    id: "ext-002",
    extended: false,
    fullscreen: true,
    status: 'approved',
    clientName: 'Hôtel Bellevue',
    vehicleName: 'Mercedes S-Class',
    driverName: 'Marie Laurent',
    reason: 'Additional stops requested',
    originalEndTime: '18:00',
    newEndTime: '20:30',
    originalEndDate: '2023-05-21',
    requestedEndDate: '2023-05-21'
  }
];
