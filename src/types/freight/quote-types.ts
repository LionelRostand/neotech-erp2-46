
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
