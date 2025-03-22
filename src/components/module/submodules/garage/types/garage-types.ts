
export interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  vehicles: string[];
  lastVisit?: string;
  totalSpent?: number;
  notes?: string;
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
  nextServiceDate?: string; // Added for compatibility
  lastService?: string;
  lastServiceDate?: string; // Added for compatibility
  technicalControlDate?: string; // Added for better vehicle management
  insuranceExpiryDate?: string; // Added for better vehicle management
  status: "available" | "in_service" | "waiting_parts" | "completed" | "active" | "in_repair";
  repairHistory?: RepairHistory[];
  notes?: string; // Added for additional vehicle information
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
  repairId?: string; // Added for backward compatibility
  date: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled" | "unpaid" | "partial";
  amount?: number;
  tax?: number; // Added for tax information
  total?: number; // Added for total amount
  paymentMethod?: string;
  notes?: string; // Added for invoice notes
}

// Adding GarageStats interface for dashboard
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
