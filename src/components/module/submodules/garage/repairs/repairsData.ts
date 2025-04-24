
import { Repair } from '../types/garage-types';

export const repairs: Repair[] = [
  {
    id: 'REP001',
    vehicleId: 'VH001',
    vehicleName: 'Peugeot 208',
    clientId: 'CL001',
    clientName: 'Martin Dubois',
    mechanicId: 'MEC001',
    mechanicName: 'Thierry Bernard',
    startDate: '2025-04-15',
    estimatedEndDate: '2025-04-18',
    status: 'in_progress',
    description: 'Remplacement des plaquettes de frein et vidange',
    progress: 50,
    estimatedCost: 280,
    licensePlate: 'AB-123-CD'
  },
  {
    id: 'REP002',
    vehicleId: 'VH002',
    vehicleName: 'Renault Clio',
    clientId: 'CL002',
    clientName: 'Sophie Martin',
    mechanicId: 'MEC002',
    mechanicName: 'Lucas Petit',
    startDate: '2025-04-16',
    estimatedEndDate: '2025-04-17',
    status: 'awaiting_parts',
    description: 'Remplacement du radiateur',
    progress: 30,
    estimatedCost: 350,
    licensePlate: 'XY-456-ZA'
  },
  {
    id: 'REP003',
    vehicleId: 'VH003',
    vehicleName: 'Citroën C3',
    clientId: 'CL003',
    clientName: 'Philippe Leclerc',
    mechanicId: 'MEC001',
    mechanicName: 'Thierry Bernard',
    startDate: '2025-04-14',
    estimatedEndDate: '2025-04-19',
    status: 'awaiting_approval',
    description: 'Réparation de la boîte de vitesse',
    progress: 0,
    estimatedCost: 950,
    licensePlate: 'BC-789-DE'
  },
  {
    id: 'REP004',
    vehicleId: 'VH004',
    vehicleName: 'Volkswagen Golf',
    clientId: 'CL004',
    clientName: 'Isabelle Dupont',
    mechanicId: 'MEC002',
    mechanicName: 'Lucas Petit',
    startDate: '2025-04-10',
    estimatedEndDate: '2025-04-14',
    status: 'completed',
    description: 'Changement de la courroie de distribution',
    progress: 100,
    estimatedCost: 580,
    actualCost: 550,
    licensePlate: 'DE-012-FG'
  }
];

export const clientsMap = {
  'CL001': 'Martin Dubois',
  'CL002': 'Sophie Martin',
  'CL003': 'Philippe Leclerc',
  'CL004': 'Isabelle Dupont',
  'CL005': 'Jean Moreau'
};

export const vehiclesMap = {
  'VH001': 'Peugeot 208',
  'VH002': 'Renault Clio',
  'VH003': 'Citroën C3',
  'VH004': 'Volkswagen Golf',
  'VH007': 'Audi A3',
  'VH008': 'BMW Série 1'
};

export const mechanicsMap = {
  'MEC001': 'Thierry Bernard',
  'MEC002': 'Lucas Petit',
  'MEC003': 'Marie Leroy',
  'MEC004': 'David Richard'
};
