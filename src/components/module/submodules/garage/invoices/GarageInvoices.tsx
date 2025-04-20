
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from 'lucide-react';
import StatCard from '@/components/StatCard';

const GarageInvoices = () => {
  const { invoices, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid' || invoice.status === 'overdue');
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Factures"
          value={invoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="Toutes les factures"
        />
        <StatCard
          title="Factures Impayées"
          value={unpaidInvoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="En attente de paiement"
        />
        <StatCard
          title="Montant Total"
          value={`${totalAmount.toLocaleString()}€`}
          icon={<Receipt className="h-4 w-4" />}
          description="Chiffre d'affaires"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Factures Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{invoice.clientName}</p>
                  <p className="text-sm text-gray-500">Facture #{invoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.total.toLocaleString()}€</p>
                  <p className="text-sm text-gray-500">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageInvoices;
