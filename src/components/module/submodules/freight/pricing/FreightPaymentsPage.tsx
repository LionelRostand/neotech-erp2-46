
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentMethod, PaymentStatus } from '../types/freight-types';
import { usePayments } from './hooks/usePayments';
import AddPaymentDialog from './components/AddPaymentDialog';
import PaymentStatusBadge from './components/PaymentStatusBadge';
import { toast } from "sonner";

const FreightPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const { payments, isLoading, reload } = usePayments();

  const filteredPayments = payments.filter(
    (payment) =>
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePaymentCreated = () => {
    toast.success("Paiement enregistré avec succès");
    reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'transfer': return 'Virement';
      case 'paypal': return 'PayPal';
      case 'cash': return 'Espèces';
      default: return method;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
        <Button onClick={() => setShowAddPayment(true)}>
          <Plus className="mr-2 h-4 w-4" /> Enregistrer un paiement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Historique des paiements</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Chargement des paiements...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Aucun paiement ne correspond à votre recherche" : "Aucun paiement enregistré"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell>{payment.clientName}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.type === "shipment" ? "Expédition" : "Conteneur"}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentDialog
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        onPaymentCreated={handlePaymentCreated}
      />
    </div>
  );
};

export default FreightPaymentsPage;
