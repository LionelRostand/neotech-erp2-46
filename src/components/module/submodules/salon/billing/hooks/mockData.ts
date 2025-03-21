
import { SalonInvoice, InvoiceStatus, PaymentMethod } from '../../types/salon-types';

// Mock data for development
export const mockInvoices: SalonInvoice[] = [
  {
    id: '1',
    number: 'FACT-2023-0001',
    clientId: 'client1',
    clientName: 'Marie Dubois',
    date: '2023-09-01',
    dueDate: '2023-09-15',
    status: 'paid' as InvoiceStatus,
    items: [
      { id: 'item1', type: 'service', name: 'Coupe femme', quantity: 1, unitPrice: 45, total: 45, serviceId: 'service1', stylistId: 'stylist1', stylistName: 'Jean Martin' }
    ],
    subtotal: 45,
    taxRate: 20,
    taxAmount: 9,
    discount: 0,
    total: 54,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-01T10:00:00Z',
    payments: [
      { id: 'payment1', invoiceId: '1', amount: 54, method: 'credit_card' as PaymentMethod, date: '2023-09-01', status: 'completed', createdAt: '2023-09-01T10:05:00Z' }
    ]
  },
  {
    id: '2',
    number: 'FACT-2023-0002',
    clientId: 'client2',
    clientName: 'Thomas Bernard',
    date: '2023-09-05',
    dueDate: '2023-09-20',
    status: 'pending' as InvoiceStatus,
    items: [
      { id: 'item2', type: 'service', name: 'Coloration', quantity: 1, unitPrice: 65, total: 65, serviceId: 'service2', stylistId: 'stylist2', stylistName: 'Sophie Petit' },
      { id: 'item3', type: 'product', name: 'Shampooing professionnel', quantity: 1, unitPrice: 18, total: 18, productId: 'product1' }
    ],
    subtotal: 83,
    taxRate: 20,
    taxAmount: 16.6,
    discount: 0,
    total: 99.6,
    createdAt: '2023-09-05T14:30:00Z',
    updatedAt: '2023-09-05T14:30:00Z',
    payments: []
  },
  {
    id: '3',
    number: 'FACT-2023-0003',
    clientId: 'client3',
    clientName: 'Lucie Martin',
    date: '2023-08-15',
    dueDate: '2023-08-30',
    status: 'overdue' as InvoiceStatus,
    items: [
      { id: 'item4', type: 'service', name: 'Balayage', quantity: 1, unitPrice: 90, total: 90, serviceId: 'service3', stylistId: 'stylist1', stylistName: 'Jean Martin' }
    ],
    subtotal: 90,
    taxRate: 20,
    taxAmount: 18,
    discount: 5,
    total: 103,
    createdAt: '2023-08-15T11:20:00Z',
    updatedAt: '2023-08-15T11:20:00Z',
    payments: [
      { id: 'payment2', invoiceId: '3', amount: 50, method: 'cash' as PaymentMethod, date: '2023-08-15', status: 'completed', createdAt: '2023-08-15T11:25:00Z' }
    ]
  }
];
