
// Garage module type definitions

export interface Client {
  id: string;
  name?: string; // Making name optional since components use firstName/lastName instead
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  vehicles?: string[]; // IDs of vehicles
  loyaltyPoints?: number;
  lastVisit?: string;
  totalSpent?: number;
  notes?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  brand?: string;
  year: number;
  licensePlate: string;
  vin?: string;
  clientId: string;
  color?: string;
  lastService?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  technicalControlDate?: string;
  insuranceExpiryDate?: string;
  status: 'available' | 'in_service' | 'waiting_parts' | 'completed' | 'active' | 'inactive' | 'in_repair';
  mileage?: number;
  notes?: string;
  repairHistory?: RepairHistory[];
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  serviceType?: string; // Making serviceType optional since it's missing in the sample data
  reason?: string;
  mechanicId?: string;
  notes?: string;
}

export interface RepairHistory {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  technicianId?: string; // Making technicianId optional so mechanicId can be used
  mechanicId?: string;
  cost: number;
  parts: RepairPart[];
  laborHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'waiting_parts';
  invoiceId?: string;
}

export interface RepairPart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  vehicleId: string;
  repairId?: string;
  date: string;
  dueDate: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax: number;
  total: number;
  amount?: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'unpaid' | 'partial';
  paymentMethod?: 'card' | 'cash' | 'transfer' | 'other';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'part' | 'labor' | 'service';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  quantityInStock: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  supplierId: string;
  location?: string;
}

export interface GarageStats {
  totalClients: number;
  totalVehicles: number;
  activeAppointments: number;
  completedRepairs: number;
  pendingInvoices: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  lowStockItems: number;
}
