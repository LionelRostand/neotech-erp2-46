
export interface Container {
  id: string;
  number: string;
  type: string;
  status: string;
  client: string;
  carrier: string;
  carrierName: string;
  origin: string;
  destination: string;
  location: string;
  departureDate?: string;
  arrivalDate?: string;
  departure?: string;
  arrival?: string;
  cost?: number;
  currency?: string;
}
