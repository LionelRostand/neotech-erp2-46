
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  clientId?: string;
  status?: 'active' | 'maintenance' | 'repair';
  [key: string]: any;
}

export interface Repair {
  id: string;
  vehicleId?: string;
  vehicleName?: string;
  clientId?: string;
  clientName?: string;
  description: string;
  mechanicId?: string;
  mechanicName?: string;
  startDate: string;
  endDate?: string;
  status: 'awaiting_approval' | 'in_progress' | 'awaiting_parts' | 'completed';
  cost?: number;
  progress?: number;
  notes?: string;
  [key: string]: any;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  clientId: string;
  clientName?: string;
  vehicleId?: string;
  vehicleName?: string;
  serviceId?: string;
  serviceName?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  [key: string]: any;
}

export interface Invoice {
  id: string;
  number?: string;
  invoiceNumber?: string;
  clientId?: string;
  clientName?: string;
  date?: string;
  dueDate?: string;
  status?: 'paid' | 'unpaid' | 'overdue' | 'pending' | 'sent';
  total?: number;
  amount?: number;
  items?: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  [key: string]: any;
}

export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  vehicles?: Vehicle[];
  [key: string]: any;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  status?: 'active' | 'inactive';
  [key: string]: any;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  quantity?: number;
  minQuantity?: number;
  price?: number;
  cost?: number;
  supplierId?: string;
  supplierName?: string;
  location?: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  [key: string]: any;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  pointsPerPurchase?: number;
  discountPerPoint?: number;
  status?: 'active' | 'inactive';
  [key: string]: any;
}

export interface GarageSettings {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  currency?: string;
  taxRate?: number;
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  [key: string]: any;
}
