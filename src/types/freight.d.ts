export interface Carrier {
  id: string;
  name: string;
  code: string;
  type: 'international' | 'national' | 'local';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  trackingUrlTemplate?: string;
  active: boolean;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number; // in hours
  transportType: 'road' | 'sea' | 'air' | 'rail' | 'multimodal';
  active: boolean;
}

export interface ShipmentLine {
  id: string;
  productName: string;
  quantity: number;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  value?: number;
  packageType?: string;
}

export interface Shipment {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  customer: string;
  carrier: string;
  carrierName: string;
  shipmentType: 'import' | 'export' | 'local' | 'international';
  status: 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';
  trackingNumber?: string;
  createdAt: string;
  scheduledDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  routeId?: string;
  lines: ShipmentLine[];
  totalWeight: number;
  notes?: string;
}

export interface PackageType {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
}

export interface Package {
  id: string;
  reference: string;
  description?: string;
  weight: number;
  weightUnit: 'kg' | 'lb';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  declaredValue?: number;
  currency?: string;
  contents?: string;
  packageType: string;
  shipmentId?: string;
  carrierId?: string;
  carrierName?: string;
  trackingNumber?: string;
  status: 'draft' | 'ready' | 'shipped' | 'delivered' | 'returned' | 'lost';
  labelGenerated: boolean;
  labelUrl?: string;
  createdAt: string;
  documents: PackageDocument[];
}

export interface PackageDocument {
  id: string;
  name: string;
  type: 'invoice' | 'delivery_note' | 'customs' | 'other';
  url?: string;
  createdAt: string;
}

export interface ShipmentFilters {
  search?: string;
  status?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  carriers?: string[];
  shipmentType?: string[];
}

// New tracking related interfaces
export interface TrackingEvent {
  id: string;
  packageId: string;
  timestamp: string;
  status: PackageStatus;
  location?: GeoLocation;
  description: string;
  isNotified: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export type PackageStatus = 
  | 'registered'
  | 'processing'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed'
  | 'exception'
  | 'returned'
  | 'lost';

export interface NotificationPreference {
  id: string;
  userId: string;
  email: boolean;
  sms: boolean;
  statuses: PackageStatus[];
}

export interface TrackingFilters {
  search?: string;
  statuses?: PackageStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  carriers?: string[];
}

export interface Quote {
  id: string;
  clientName: string;
  clientId: string;
  createdAt: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'converted';
  totalAmount: number;
  items: QuoteItem[];
  shipmentDetails: {
    origin: string;
    destination: string;
    estimatedDistance: number;
    weight: number;
    volume: number;
  };
  acceptedDate?: string;
  declinedDate?: string;
  declineReason?: string;
  convertedDate?: string;
  invoiceId?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  reference: string;
  clientName: string;
  clientId: string;
  createdAt: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'partially_paid' | 'overdue' | 'cancelled';
  totalAmount: number;
  paidAmount?: number;
  items: InvoiceItem[];
  shipmentId?: string;
  paymentDetails?: {
    method: 'bank_transfer' | 'card' | 'cash' | 'check' | string;
    date?: string;
    transactionId?: string;
  };
  cancelReason?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Adding Container interface that will be shared across components
export interface Container {
  id: string;
  number: string;
  type: string;
  size: string;
  status: string;
  carrierName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  // These properties are used in ContainerDetailsDialog
  location: string;
  client: string;
  departure: string;
  arrival: string;
}

// Adding ShipmentFormData type for our form
export interface ShipmentFormData {
  reference: string;
  origin: string;
  destination: string;
  customer: string;
  customerName: string;
  carrier: string;
  carrierName: string;
  shipmentType: 'import' | 'export' | 'local' | 'international';
  status: 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';
  scheduledDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  routeId?: string;
  lines: ShipmentLine[];
  totalWeight: number;
  notes?: string;
  trackingNumber?: string;
  createdAt?: string;
  id?: string;
}
