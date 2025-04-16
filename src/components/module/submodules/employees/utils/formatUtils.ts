
import { EmployeeAddress } from '@/types/employee';

export const formatAddress = (address: EmployeeAddress | string): string => {
  if (typeof address === 'string') {
    return address;
  }
  
  const parts = [];
  
  if (address.street) {
    parts.push(address.street);
  }
  
  const cityParts = [];
  if (address.postalCode) cityParts.push(address.postalCode);
  if (address.city) cityParts.push(address.city);
  if (cityParts.length > 0) {
    parts.push(cityParts.join(' '));
  }
  
  if (address.state) {
    parts.push(address.state);
  }
  
  if (address.country && address.country.toLowerCase() !== 'france') {
    parts.push(address.country);
  }
  
  return parts.join(', ');
};
