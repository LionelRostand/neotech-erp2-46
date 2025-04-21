
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
