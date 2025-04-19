
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download 
} from 'lucide-react';
import { usePaymentsData } from './hooks/usePaymentsData';
import PaymentViewDialog from './components/PaymentViewDialog';
import { Payment } from './types/accounting-types';

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { payments, isLoading, error } = usePaymentsData();

  const filteredPayments = payments.filter(payment => 
    payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Liste des Paiements</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un paiement..."
                className="w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement des paiements...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Erreur de chargement : {error.message}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun paiement trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Numéro de Facture</th>
                    <th className="text-left p-2">Client</th>
                    <th className="text-left p-2">Montant</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{payment.date}</td>
                      <td className="p-2">{payment.invoiceNumber}</td>
                      <td className="p-2">{payment.clientName}</td>
                      <td className="p-2">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: payment.currency || 'EUR' 
                        }).format(payment.amount)}
                      </td>
                      <td className="p-2">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {payment.status === 'completed' ? 'Terminé' : 
                           payment.status === 'pending' ? 'En attente' : 
                           'Échoué'}
                        </span>
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentViewDialog 
          open={!!selectedPayment}
          onOpenChange={() => setSelectedPayment(null)}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
