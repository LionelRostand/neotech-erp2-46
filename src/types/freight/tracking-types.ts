
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
