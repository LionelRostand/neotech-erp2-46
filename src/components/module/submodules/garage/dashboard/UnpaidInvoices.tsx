
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useHasPermission } from '@/hooks/useHasPermission';
import { Shield } from 'lucide-react';

const UnpaidInvoices = () => {
  const { invoices } = useGarageData();
  const hasViewPermission = useHasPermission('garage-invoices', 'view');
  
  if (!hasViewPermission) {
    return (
      <div className="text-center py-4 border rounded-md">
        <Shield className="mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500">Vous n'avez pas les permissions nécessaires</p>
      </div>
    );
  }
  
  // Filtrer les factures impayées ou en retard
  const unpaidInvoices = invoices.filter(invoice => 
    invoice?.status === 'unpaid' || 
    invoice?.status === 'overdue' || 
    invoice?.status === 'pending' || 
    invoice?.status === 'sent'
  );

  if (unpaidInvoices.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucune facture impayée</div>;
  }

  return (
    <div className="space-y-3">
      {unpaidInvoices.slice(0, 5).map((invoice) => (
        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">
              Facture #{invoice.number || invoice.invoiceNumber || invoice.id?.substring(0, 6)}
            </p>
            <p className="text-sm text-gray-500">{invoice.clientName || "Client non spécifié"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {invoice.amount !== undefined ? invoice.amount.toLocaleString('fr-FR') : 
               invoice.total !== undefined ? invoice.total.toLocaleString('fr-FR') : '0'} €
            </p>
            <p className="text-xs text-red-500">
              Échéance: {invoice.dueDate ? 
                (typeof invoice.dueDate === 'string' ? invoice.dueDate : format(new Date(invoice.dueDate), 'dd/MM/yyyy')) 
                : 'Immédiate'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnpaidInvoices;
