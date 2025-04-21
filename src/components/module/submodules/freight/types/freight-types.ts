
// Types pour les paiements
export type PaymentMethod = 'card' | 'transfer' | 'paypal' | 'cash';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled';
export type PaymentType = 'shipment' | 'container';

export interface FreightPayment {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  referenceId: string;
  reference: string; // Numéro d'expédition ou de conteneur
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  invoiceNumber: string;
  transactionId?: string;
  notes?: string;
  currency?: string;
}

// Types pour les clients
export type ClientType = 'individual' | 'enterprise';
export type ClientStatus = 'active' | 'inactive' | 'pending';

export interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  contactPerson?: string;
  type: ClientType;
  status: ClientStatus;
  notes?: string;
}

// Types pour les expéditions
export type ShipmentType = 'import' | 'export' | 'local' | 'international';
export type ShipmentStatus = 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';

export interface FreightShipment {
  id: string;
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  carrier: string;
  carrierName: string;
  shipmentType: ShipmentType;
  status: ShipmentStatus;
  departureDate: string;
  estimatedArrival: string;
  arrivalDate?: string;
  cost: number;
  currency: string;
  description: string;
  weight: number;
  weightUnit: 'kg' | 'lb';
  notes?: string;
}

// Autres types nécessaires
export interface Carrier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  transportTypes: string[];
  status: 'active' | 'inactive';
}
