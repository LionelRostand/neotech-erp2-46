
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
  cost: number;
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
  totalPrice?: number;
}

export interface ShipmentFormData {
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
