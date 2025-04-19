
import { Invoice } from '../types/garage-types';

export const invoices: Invoice[] = [
  {
    id: 'INV001',
    repairId: 'REP001',
    vehicleId: 'VH001',
    vehicleName: 'Peugeot 208',
    clientId: 'CL001',
    clientName: 'Martin Dubois',
    date: '2025-04-15',
    dueDate: '2025-05-15',
    status: 'sent',
    items: [
      {
        id: 'ITEM001',
        description: 'Plaquettes de frein',
        quantity: 1,
        unitPrice: 150,
        total: 150,
        type: 'part'
      },
      {
        id: 'ITEM002',
        description: 'Main d\'œuvre',
        quantity: 2,
        unitPrice: 65,
        total: 130,
        type: 'labor'
      }
    ],
    subtotal: 280,
    tax: 56,
    total: 336
  }
];
