
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
  location: string;
  client: string;
  departure?: string;
  arrival?: string;
  articles?: any[];
  costs?: Array<{
    amount: number;
    description?: string;
    currency?: string;
    type?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
