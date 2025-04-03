
export interface MapExtensionRequest {
  id: string;
  requestId: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedExtension?: number;
  originalEndTime?: string;
  newEndTime?: string;
  timestamp?: string;
  clientName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  extensionReason?: string;
  createdAt?: string;
  requestDate?: string;
  requestedAt?: string;
  extraTimeMinutes?: number;
  additionalTime?: number;
  extensionDays?: number;
  responseMessage?: string;
  extended?: boolean;
  fullscreen?: boolean;
}
