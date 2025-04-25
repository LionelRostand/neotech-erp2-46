
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  vehicles?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  clientId: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastService?: string;
  mileage?: number;
  color?: string;
  notes?: string;
}

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  status: 'available' | 'in_service' | 'on_break' | 'off_duty';
  hireDate: string;
  photo?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  mechanicId?: string;
  category?: string;
}

export interface Repair {
  id: string;
  vehicleId: string;
  mechanicId: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  cost: number;
  parts?: RepairPart[];
  laborHours?: number;
  notes?: string;
}

export interface RepairPart {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface GarageAppointment {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId?: string;
  serviceId?: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  type?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  notes?: string;
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  reference: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplierRef?: string;
  location?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastOrderDate?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  vehicleId: string;
  repairId?: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  discountRate: number;
  requiredVisits: number;
  status: 'active' | 'inactive';
  startDate: string;
  endDate?: string;
  clients?: string[];
}
