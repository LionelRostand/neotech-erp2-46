
// Define types specific to map functionality

export interface MapExtensionRequest {
  id: string;
  extended: boolean;
  fullscreen: boolean;
  status: 'pending' | 'approved' | 'rejected';
  clientName: string;
  vehicleName: string;
  driverName?: string;
  reason: string;
  originalEndTime: string;
  newEndTime: string;
  originalEndDate: string;
  requestedEndDate: string;
  extensionReason?: string;
  requestId?: string; // Adding this field which is used in ExtensionRequestsList
}
