
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

// Sample data for unpaid invoices
const invoices = [
  { 
    id: 'INV-2023-056', 
    client: 'Michel Blanc', 
    vehicle: 'BMW Série 3', 
    amount: 345.60, 
    date: '2023-11-25',
    daysOverdue: 15
  },
  { 
    id: 'INV-2023-062', 
    client: 'Laure Mercier', 
    vehicle: 'Audi A3', 
    amount: 520.00, 
    date: '2023-12-05',
    daysOverdue: 5
  },
  { 
    id: 'INV-2023-067', 
    client: 'François Laurent', 
    vehicle: 'Mercedes Classe C', 
    amount: 890.75, 
    date: '2023-12-08',
    daysOverdue: 2
  },
  { 
    id: 'INV-2023-069', 
    client: 'Julie Dufour', 
    vehicle: 'Toyota Yaris', 
    amount: 230.20, 
    date: '2023-12-10',
    daysOverdue: 0
  }
];

export const UnpaidInvoices = () => {
  const handleSendReminder = (invoiceId: string) => {
    console.log(`Sending reminder for invoice ${invoiceId}`);
    // Here we would implement the reminder email/SMS functionality
  };

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Aucune facture impayée
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
          {invoices.map(invoice => (
            <div 
              key={invoice.id} 
              className={`flex justify-between items-center p-3 rounded-md hover:bg-gray-100 transition-colors ${
                invoice.daysOverdue > 10 ? 'bg-red-50' : 
                invoice.daysOverdue > 0 ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{invoice.id}</span>
                  {invoice.daysOverdue > 10 && (
                    <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-xs text-gray-500">{invoice.client} - {invoice.vehicle}</div>
                <div className="text-xs">
                  <span className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}</span>
                  <span className="text-gray-500 ml-2">
                    {invoice.daysOverdue > 0 ? 
                      `En retard de ${invoice.daysOverdue} jour${invoice.daysOverdue > 1 ? 's' : ''}` : 
                      'À échéance aujourd\'hui'
                    }
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendReminder(invoice.id)}
                className="whitespace-nowrap"
              >
                Rappel
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
