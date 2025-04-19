
import { Supplier } from '../types/garage-types';

export const suppliers: Supplier[] = [
  {
    id: 'SUP001',
    name: 'Auto Pièces Express',
    email: 'contact@autopiecesexpress.fr',
    phone: '01 23 45 67 89',
    address: '123 Rue de la Mécanique, 75001 Paris',
    category: 'parts',
    specialties: ['Freins', 'Suspension', 'Filtration'],
    rating: 4.5,
    activeContracts: 3,
    status: 'active',
    lastOrderDate: '2025-04-15',
    paymentTerms: 'Net 30',
  },
  {
    id: 'SUP002',
    name: 'Outils Pro Auto',
    email: 'ventes@outilsproauto.fr',
    phone: '01 98 76 54 32',
    address: '456 Avenue des Outils, 69001 Lyon',
    category: 'tools',
    specialties: ['Outillage spécialisé', 'Diagnostic', 'Équipement atelier'],
    rating: 4.8,
    activeContracts: 2,
    status: 'active',
    lastOrderDate: '2025-04-10',
    paymentTerms: 'Net 45',
  },
];
