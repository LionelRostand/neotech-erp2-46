
// Type definitions for garage module

export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  mileage?: number;
  lastService?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  specialties?: string[];
  email?: string;
  phone?: string;
  status?: 'active' | 'on_leave' | 'inactive';
  hireDate?: string;
  notes?: string;
}

export interface Repair {
  id: string;
  clientId?: string;
  clientName?: string;
  vehicleId?: string;
  vehicleName?: string;
  mechanicId?: string;
  mechanicName?: string;
  description: string;
  status: 'awaiting_approval' | 'in_progress' | 'awaiting_parts' | 'completed' | 'cancelled';
  startDate?: string;
  estimatedEndDate?: string;
  completionDate?: string;
  progress: number;
  cost?: number;
  parts?: RepairPart[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RepairPart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: 'in_stock' | 'ordered' | 'received' | 'installed';
  orderedDate?: string;
  receivedDate?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName?: string;
  vehicleId?: string;
  vehicleName?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName?: string;
  vehicleId?: string;
  vehicleName?: string;
  repairId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  website?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  sellingPrice: number;
  supplierId?: string;
  supplierName?: string;
  location?: string;
  notes?: string;
  lastOrdered?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  discountPerPoint: number;
  minPointsForRedemption: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GarageSettings {
  id: string;
  businessName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  vatNumber?: string;
  currencySymbol: string;
  workingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
  logo?: string;
  updatedAt?: string;
}
