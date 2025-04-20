
export interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  status: 'available' | 'rented' | 'maintenance';
  location?: Location;
}
