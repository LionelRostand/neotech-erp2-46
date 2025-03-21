
import { SalonInvoice } from '../../types/salon-types';

// Generate date X days from now
const getDatePlusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Sample invoices for the salon billing module
export const mockInvoices: SalonInvoice[] = [
  {
    id: '1',
    number: 'FACT-202303-0001',
    clientId: 'client-001',
    clientName: 'Sophie Dubois',
    date: getDatePlusDays(-15),
    dueDate: getDatePlusDays(-5),
    status: 'paid',
    items: [
      {
        id: 'item-001',
        description: 'Coupe femme',
        quantity: 1,
        unitPrice: 45,
        taxRate: 20,
        total: 45
      },
      {
        id: 'item-002',
        description: 'Coloration',
        quantity: 1,
        unitPrice: 65,
        taxRate: 20,
        total: 65
      }
    ],
    subtotal: 110,
    taxAmount: 22,
    total: 132,
    payments: [
      {
        id: 'payment-001',
        date: getDatePlusDays(-15),
        method: 'credit_card',
        amount: 132,
        reference: 'TXID-12345',
        status: 'completed',
        createdAt: getDatePlusDays(-15)
      }
    ],
    createdAt: getDatePlusDays(-15),
    updatedAt: getDatePlusDays(-15)
  },
  {
    id: '2',
    number: 'FACT-202303-0002',
    clientId: 'client-002',
    clientName: 'Thomas Martin',
    date: getDatePlusDays(-10),
    dueDate: getDatePlusDays(5),
    status: 'sent',
    items: [
      {
        id: 'item-003',
        description: 'Coupe homme',
        quantity: 1,
        unitPrice: 35,
        taxRate: 20,
        total: 35
      },
      {
        id: 'item-004',
        description: 'Barbe',
        quantity: 1,
        unitPrice: 25,
        taxRate: 20,
        total: 25
      }
    ],
    subtotal: 60,
    taxAmount: 12,
    total: 72,
    payments: [],
    createdAt: getDatePlusDays(-10),
    updatedAt: getDatePlusDays(-10)
  },
  {
    id: '3',
    number: 'FACT-202303-0003',
    clientId: 'client-003',
    clientName: 'Marie Lefebvre',
    date: getDatePlusDays(-30),
    dueDate: getDatePlusDays(-15),
    status: 'overdue',
    items: [
      {
        id: 'item-005',
        description: 'Balayage',
        quantity: 1,
        unitPrice: 85,
        taxRate: 20,
        total: 85
      },
      {
        id: 'item-006',
        description: 'Coupe femme',
        quantity: 1,
        unitPrice: 45,
        taxRate: 20,
        total: 45
      },
      {
        id: 'item-007',
        description: 'Brushing',
        quantity: 1,
        unitPrice: 35,
        taxRate: 20,
        total: 35
      }
    ],
    subtotal: 165,
    taxAmount: 33,
    total: 198,
    payments: [
      {
        id: 'payment-002',
        date: getDatePlusDays(-30),
        method: 'cash',
        amount: 100,
        status: 'completed',
        createdAt: getDatePlusDays(-30)
      }
    ],
    createdAt: getDatePlusDays(-30),
    updatedAt: getDatePlusDays(-30)
  },
  {
    id: '4',
    number: 'FACT-202303-0004',
    clientId: 'client-004',
    clientName: 'Jean Dupont',
    date: getDatePlusDays(-5),
    dueDate: getDatePlusDays(10),
    status: 'draft',
    items: [
      {
        id: 'item-008',
        description: 'Coupe homme',
        quantity: 1,
        unitPrice: 35,
        taxRate: 20,
        total: 35
      }
    ],
    subtotal: 35,
    taxAmount: 7,
    total: 42,
    payments: [],
    createdAt: getDatePlusDays(-5),
    updatedAt: getDatePlusDays(-5)
  },
  {
    id: '5',
    number: 'FACT-202303-0005',
    clientId: 'client-005',
    clientName: 'Lucie Bernard',
    date: getDatePlusDays(-2),
    dueDate: getDatePlusDays(13),
    status: 'sent',
    items: [
      {
        id: 'item-009',
        description: 'Coupe femme',
        quantity: 1,
        unitPrice: 45,
        taxRate: 20,
        total: 45
      },
      {
        id: 'item-010',
        description: 'Soin capillaire',
        quantity: 1,
        unitPrice: 25,
        taxRate: 20,
        total: 25
      }
    ],
    subtotal: 70,
    taxAmount: 14,
    total: 84,
    payments: [
      {
        id: 'payment-003',
        date: getDatePlusDays(-2),
        method: 'mobile_payment',
        amount: 42,
        reference: 'MPAY-54321',
        status: 'completed',
        createdAt: getDatePlusDays(-2)
      }
    ],
    createdAt: getDatePlusDays(-2),
    updatedAt: getDatePlusDays(-2)
  }
];
