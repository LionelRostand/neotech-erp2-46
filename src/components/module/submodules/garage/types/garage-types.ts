
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId: string;
  type: string;
  status: 'available' | 'maintenance' | 'repair';
}

export interface Mechanic {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  status: 'available' | 'busy' | 'onBreak';
}

export interface Repair {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  description: string;
  estimatedCost: number;
  status: 'pending' | 'in_progress' | 'awaiting_parts' | 'awaiting_approval' | 'completed' | 'cancelled';
  createdAt: string;
  // Additional fields that appear to be used but were not defined in the original interface
  clientName?: string;
  vehicleName?: string;
  mechanicName?: string;
  progress?: number;
}

export interface GarageService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  status: 'active' | 'inactive';
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
