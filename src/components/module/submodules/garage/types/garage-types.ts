
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vehicles: string[];
  lastVisit: string;
  totalSpent: number;
  notes: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  mileage: number;
  nextServiceDate: string;
  lastServiceDate: string;
  technicalControlDate: string;
  insuranceExpiryDate: string;
  status: string;
  notes: string;
  repairHistory: RepairHistory[];
}

export interface RepairHistory {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  parts: string[];
  laborHours: number;
  mechanicId: string;
  status: string;
  invoiceId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  mechanicId: string;
  status: string;
  notes: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  vehicleId: string;
  repairId: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod?: string;
  notes: string;
}

export interface GarageStats {
  totalRepairs: number;
  ongoingRepairs: number;
  completedRepairs: number;
  totalVehicles: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  revenueChange: number;
  retentionRate: number;
  todaysAppointments: number;
  unpaidInvoices: number;
  lowStockItems: number;
  customerCount: number;
  newCustomersThisMonth: number;
}
