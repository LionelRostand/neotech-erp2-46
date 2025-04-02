
// base-types.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  entityId: string;
  entityType: 'vehicle' | 'driver' | 'client' | 'reservation';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  type: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minDuration?: number;
  vehicleTypes: string[];
  active: boolean;
}

export interface TransportBasic {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  [key: string]: any;
}
