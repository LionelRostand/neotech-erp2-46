
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
