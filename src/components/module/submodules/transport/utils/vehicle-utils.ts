
import { TransportVehicle } from '../types/vehicle-types';
import { TransportVehicleWithLocation } from '../types/transport-types';

// Function to get status badge color
export const getVehicleStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500';
    case 'maintenance':
      return 'bg-amber-500';
    case 'reserved':
      return 'bg-blue-500';
    case 'out-of-service':
      return 'bg-red-500';
    case 'inactive':
      return 'bg-gray-500';
    case 'available':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-400';
  }
};

// Function to check if vehicle needs maintenance
export const needsMaintenance = (vehicle: TransportVehicle): boolean => {
  if (!vehicle.lastServiceDate || !vehicle.nextServiceDate) return false;
  
  const nextService = new Date(vehicle.nextServiceDate);
  const today = new Date();
  
  // Return true if next service date is within 7 days or past due
  const daysUntilService = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilService <= 7;
};

// Function to format vehicle type for display
export const formatVehicleType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
