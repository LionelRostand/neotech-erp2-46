
import React from 'react';
import InvoiceDetail from '@/components/module/billing/InvoiceDetail';
import DashboardLayout from '@/components/DashboardLayout';

const InvoicePage: React.FC = () => {
  // Sample invoice data
  const sampleInvoice = {
    id: 'inv-2025-0001',
    number: 'FACT-2025-0001',
    date: '2025-04-05',
    dueDate: '2025-05-05',
    client: {
      id: 'client-001',
      name: 'Acme Corporation',
      address: '123 Business Avenue\n75008 Paris\nFrance',
      email: 'billing@acme-corp.com',
    },
    items: [
      {
        id: 'item-001',
        description: 'Développement application web',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000,
      },
      {
        id: 'item-002',
        description: 'Hébergement et maintenance (12 mois)',
        quantity: 12,
        unitPrice: 250,
        totalPrice: 3000,
      },
      {
        id: 'item-003',
        description: 'Intégration API supplémentaire',
        quantity: 2,
        unitPrice: 750,
        totalPrice: 1500,
      }
    ],
    subtotal: 9500,
    tax: 1900,
    total: 11400,
    status: 'sent' as const,
  };

  return (
    <DashboardLayout>
      <InvoiceDetail invoice={sampleInvoice} />
    </DashboardLayout>
  );
};

export default InvoicePage;
