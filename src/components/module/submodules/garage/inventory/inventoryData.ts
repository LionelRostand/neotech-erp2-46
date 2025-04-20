
interface VehicleInventoryItem {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: 'Client' | 'Vente';
  owner?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  price?: number;
  mileage: number;
  lastService?: string;
}

export const vehicleInventory: VehicleInventoryItem[] = [
  {
    id: 'VIN001',
    licensePlate: 'AB-123-CD',
    brand: 'Peugeot',
    model: '308',
    year: 2020,
    type: 'Client',
    owner: 'Jean Dupont',
    condition: 'good',
    mileage: 45000,
    lastService: '2025-03-15',
  },
  {
    id: 'VIN002',
    licensePlate: 'EF-456-GH',
    brand: 'Renault',
    model: 'Clio',
    year: 2022,
    type: 'Vente',
    condition: 'excellent',
    price: 15900,
    mileage: 12000,
  },
  {
    id: 'VIN003',
    licensePlate: 'IJ-789-KL',
    brand: 'Citroën',
    model: 'C3',
    year: 2021,
    type: 'Client',
    owner: 'Marie Martin',
    condition: 'fair',
    mileage: 68000,
    lastService: '2025-02-28',
  },
  {
    id: 'VIN004',
    licensePlate: 'MN-012-OP',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    type: 'Vente',
    condition: 'excellent',
    price: 28500,
    mileage: 5000,
  },
  {
    id: 'VIN005',
    licensePlate: 'QR-345-ST',
    brand: 'Toyota',
    model: 'Yaris',
    year: 2019,
    type: 'Client',
    owner: 'Pierre Durand',
    condition: 'poor',
    mileage: 95000,
    lastService: '2025-04-10',
  }
];
