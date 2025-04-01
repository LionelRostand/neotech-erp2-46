
import { TransportVehicleWithLocation } from "../types/map-types";

export const getVehicleStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'En service';
    case 'maintenance':
      return 'En maintenance';
    case 'out-of-service':
      return 'Hors service';
    case 'available':
      return 'Disponible';
    case 'unavailable':
      return 'Indisponible';
    default:
      return status;
  }
};

export const getVehicleTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'sedan':
      return 'Berline';
    case 'suv':
      return 'SUV';
    case 'van':
      return 'Minivan';
    case 'bus':
      return 'Bus';
    case 'minibus':
      return 'Minibus';
    case 'luxury':
      return 'Luxe';
    default:
      return type;
  }
};

export const getVehicleStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'available':
    case 'en service':
      return 'bg-green-500';
    case 'maintenance':
    case 'en maintenance':
      return 'bg-yellow-500';
    case 'out-of-service':
    case 'hors service':
    case 'unavailable':
    case 'indisponible':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Generate a formatted vehicle ID
export const generateVehicleId = (): string => {
  const prefix = 'VEH';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${random}`;
};

// Calculate vehicle age in years from purchase date
export const calculateVehicleAge = (purchaseDate: string): number => {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  return now.getFullYear() - purchase.getFullYear();
};

// Check if maintenance is due soon (within 30 days)
export const isMaintenanceDueSoon = (nextServiceDate: string): boolean => {
  const service = new Date(nextServiceDate);
  const now = new Date();
  const diffTime = service.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 30;
};
