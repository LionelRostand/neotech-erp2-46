
export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  status: 'available' | 'driving' | 'off-duty' | 'vacation' | 'sick';
  rating: number;
  completedTrips: number;
}

export interface DriversTableProps {
  searchTerm: string;
}
