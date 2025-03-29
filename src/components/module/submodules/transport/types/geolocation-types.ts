
import { TransportVehicleWithLocation } from './map-types';

export interface VehicleAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  type: 'speeding' | 'unauthorized' | 'geofence' | 'maintenance' | 'other';
  message: string;
  timestamp: string;
  status: 'resolved' | 'unresolved';
  location?: {
    lat: number;
    lng: number;
  };
  speed?: number;
  speedLimit?: number;
}

export interface RouteOptimization {
  id: string;
  vehicleId: string;
  vehicleName: string;
  currentRoute: string;
  optimizedRoute: string;
  savingsMinutes: number;
  savingsKm: number;
  applied?: boolean;
}

export interface AlertConfig {
  enableSpeedAlerts: boolean;
  speedThreshold: string;
  enableGeofenceAlerts: boolean;
  enableUnauthorizedUseAlerts: boolean;
  unauthorizedStartHour: string;
  unauthorizedEndHour: string;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  emailRecipients: string;
  autoResolveAfterHours: string;
  alertPriority: 'low' | 'medium' | 'high';
}
