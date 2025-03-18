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
