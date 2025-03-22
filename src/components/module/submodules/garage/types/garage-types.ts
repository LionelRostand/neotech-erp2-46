
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
  name?: string; // Added for compatibility
}

export interface RepairHistory {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  parts: any[];
  laborHours: number;
  mechanicId?: string;
  technicianId?: string; // Added for compatibility
  status: "in_progress" | "completed" | "cancelled";
  invoiceId: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  brand?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  color?: string;
  mileage?: number;
  nextService?: string;
  lastService?: string;
  status: "available" | "in_service" | "waiting_parts" | "completed";
  repairHistory?: RepairHistory[];
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  duration: number;
  serviceType?: string;
  reason?: string;
  mechanicId?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  vehicleId: string;
  repairs: string[];
  date: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled" | "unpaid" | "partial";
  amount?: number;
  paymentMethod?: string;
}
