
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';

const UnpaidInvoices = () => {
  const { invoices } = useGarageData();
  
  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid');

  if (unpaidInvoices.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucune facture impayée</div>;
  }

  return (
    <div className="space-y-3">
      {unpaidInvoices.slice(0, 5).map((invoice) => (
        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">Facture #{invoice.number || invoice.id.substring(0, 6)}</p>
            <p className="text-sm text-gray-500">{invoice.clientName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{invoice.amount?.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-red-500">Échéance: {invoice.dueDate || 'Immédiate'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnpaidInvoices;
