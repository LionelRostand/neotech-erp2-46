
// Mock data for vehicle utilization rates
export const getUtilizationData = () => [
  { category: 'Citadine', utilisationRate: 78 },
  { category: 'Compacte', utilisationRate: 82 },
  { category: 'Berline', utilisationRate: 65 },
  { category: 'SUV', utilisationRate: 90 },
  { category: 'Premium', utilisationRate: 60 },
  { category: 'Utilitaire', utilisationRate: 85 },
];

// Mock data for maintenance metrics
export const getMaintenanceData = () => [
  { name: 'Pannes', value: 12 },
  { name: 'Entretien', value: 45 },
  { name: 'Accidents', value: 8 },
  { name: 'Usure normale', value: 35 },
];

// Mock data for satisfaction metrics per vehicle type
export const getSatisfactionData = () => [
  { 
    category: 'Citadine',
    confort: 4.1,
    proprete: 4.5,
    fiabilite: 4.2,
    rapport: 4.7,
    services: 4.0,
  },
  { 
    category: 'Compacte',
    confort: 4.3,
    proprete: 4.4,
    fiabilite: 4.3,
    rapport: 4.5,
    services: 4.2,
  },
  { 
    category: 'Berline',
    confort: 4.6,
    proprete: 4.3,
    fiabilite: 4.5,
    rapport: 4.1,
    services: 4.4,
  },
  { 
    category: 'SUV',
    confort: 4.8,
    proprete: 4.6,
    fiabilite: 4.4,
    rapport: 4.0,
    services: 4.5,
  },
  { 
    category: 'Premium',
    confort: 4.9,
    proprete: 4.7,
    fiabilite: 4.6,
    rapport: 3.9,
    services: 4.8,
  },
];

// Mock data for most rented vehicles
export const getMostRentedVehicles = () => [
  { id: 1, model: 'Peugeot 208', category: 'Citadine', rentals: 45, revenue: 9800, rating: 4.7 },
  { id: 2, model: 'Renault Clio', category: 'Citadine', rentals: 38, revenue: 8200, rating: 4.5 },
  { id: 3, model: 'Toyota RAV4', category: 'SUV', rentals: 36, revenue: 12600, rating: 4.8 },
  { id: 4, model: 'Volkswagen Golf', category: 'Compacte', rentals: 32, revenue: 9500, rating: 4.6 },
  { id: 5, model: 'Citroën C3', category: 'Citadine', rentals: 30, revenue: 6400, rating: 4.4 },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};
