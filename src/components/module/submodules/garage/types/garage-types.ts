
// Dashboard statistics
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

// Client types
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vehicles: string[]; // Array of vehicle IDs
  lastVisit: string;
  totalSpent: number;
  notes: string;
  createdAt: string;
}

// Vehicle types
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
  status: 'active' | 'inactive' | 'in_repair';
  notes: string;
  repairHistory: RepairHistory[];
}

// Repair types
export interface RepairHistory {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  parts: Part[];
  laborHours: number;
  mechanicId: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  invoiceId: string;
}

// Appointment types
export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  reason: string;
  mechanicId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

// Invoice types
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
  status: 'paid' | 'unpaid' | 'partial' | 'cancelled';
  paymentMethod?: string;
  notes: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[]; // Array of product IDs
  orders: Order[];
  notes: string;
}

// Inventory types
export interface Part {
  id: string;
  name: string;
  reference: string;
  brand: string;
  category: string;
  compatibleVehicles: string[]; // Array of vehicle brands/models
  stock: number;
  minStock: number;
  price: number;
  supplierIds: string[];
  location: string;
  notes: string;
}

// Order types
export interface Order {
  id: string;
  supplierId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  expectedDeliveryDate: string;
  deliveryDate?: string;
  notes: string;
}

export interface OrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
}

// Loyalty program types
export interface LoyaltyProgram {
  id: string;
  clientId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
  transactions: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  programId: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem';
  description: string;
}

// Employee types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: 'mechanic' | 'receptionist' | 'manager' | 'admin';
  email: string;
  phone: string;
  skills: string[];
  schedule: WorkSchedule[];
}

export interface WorkSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}
