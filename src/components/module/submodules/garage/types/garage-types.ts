export interface Repair {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  mechanicId: string;
  mechanicName: string;
  startDate: string;
  estimatedEndDate: string;
  status: 'awaiting_approval' | 'in_progress' | 'awaiting_parts' | 'completed';
  description: string;
  progress: number;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  licensePlate?: string;
}

export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vehicles?: string[];
  loyaltyPoints?: number;
  lastVisit?: string;
  totalSpent?: number;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleMake?: string;
  vehicleModel?: string;
  date: string;
  time: string;
  duration: number;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  notes?: string;
  mechanicId?: string;
  mechanicName?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  clientId: string;
  clientName: string;
  color: string;
  mileage: number;
  lastServiceDate?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Invoice {
  id: string;
  repairId?: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
  paymentDate?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'part' | 'labor';
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: 'parts' | 'accessories' | 'tools' | 'other';
  specialties: string[];
  rating: number;
  activeContracts: number;
  status: 'active' | 'inactive';
  lastOrderDate?: string;
  paymentTerms?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  location: string;
  lastRestocked?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  minimumPoints: number;
  rewards: {
    points: number;
    discount: number;
    description: string;
  }[];
}

export interface GarageSettings {
  id: string;
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  workingHours: {
    [key: string]: { start: string; end: string };
  };
  defaultSettings: {
    autoNotifications: boolean;
    requireConfirmation: boolean;
  };
}
