
export type Supplier = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  notes: string;
  createdAt: string;
};

export type Order = {
  id: string;
  supplierId: string;
  supplierName: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string | null;
  deliveryDate: string | null;
  products: Array<{productId: string, name: string, quantity: number, price: number}>;
  total: number;
  notes: string;
};

export type NewProduct = {
  name: string;
  brand: string;
  category: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
};

export type NewSupplier = {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export type NewOrder = {
  supplierId: string;
  products: any[];
  notes: string;
  expectedDeliveryDate: string;
};

// Loyalty related types
export type LoyaltyReward = {
  id: string;
  name: string;
  points: number;
  description: string;
  active: boolean;
  createdAt: string;
};

export type NewLoyaltyReward = {
  name: string;
  points: number;
  description: string;
};

export type LoyaltyClient = {
  id: string;
  name: string;
  points: number;
  status: 'gold' | 'silver' | 'bronze';
  visits: number;
  lastVisit: string;
};

// Report related types
export type SalonReportData = {
  timeRange: string;
  revenueData: {
    totalRevenue: number;
    revenueByService: Record<string, number>;
    revenueByEmployee: Record<string, number>;
    revenueOverTime: Array<{date: string, revenue: number}>;
  };
  appointmentsData: {
    totalAppointments: number;
    appointmentsByService: Record<string, number>;
    appointmentsByEmployee: Record<string, number>;
    appointmentsOverTime: Array<{date: string, count: number}>;
    completionRate: number;
  };
  clientsData: {
    totalClients: number;
    newClients: number;
    returningClients: number;
    clientsOverTime: Array<{date: string, new: number, returning: number}>;
    retentionRate: number;
  };
  productsData: {
    totalSold: number;
    totalRevenue: number;
    topProducts: Array<{name: string, sold: number, revenue: number}>;
    salesOverTime: Array<{date: string, sold: number, revenue: number}>;
  };
};

