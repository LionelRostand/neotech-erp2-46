
// Garage module type definitions

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  vehicles?: string[]; // IDs of vehicles
  loyaltyPoints?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  clientId: string;
  color?: string;
  lastService?: string;
  status: 'available' | 'in_service' | 'waiting_parts' | 'completed';
  mileage?: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  serviceType: string;
  notes?: string;
}

export interface RepairHistory {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  technicianId: string;
  cost: number;
  parts: RepairPart[];
  laborHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'waiting_parts';
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
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
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
