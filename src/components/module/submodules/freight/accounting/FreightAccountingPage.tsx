
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInvoicesData } from '@/components/module/submodules/accounting/hooks/useInvoicesData';
import { InvoicesTable } from '@/components/module/submodules/accounting/components/InvoicesTable';
import FreightAccountingSummaryDialog from '../FreightAccountingSummaryDialog';
import { usePaymentsData } from '@/components/module/submodules/accounting/hooks/usePaymentsData';
import PaymentFormDialog from '@/components/module/submodules/accounting/components/PaymentFormDialog';
import { toast } from '@/hooks/use-toast';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Payment } from '@/components/module/submodules/accounting/types/accounting-types';

const FreightAccountingPage = () => {
  const { invoices, isLoading: isLoadingInvoices } = useInvoicesData();
  const { payments, isLoading: isLoadingPayments } = usePaymentsData();
  const [activeTab, setActiveTab] = useState('invoices');
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  // Ensure that all data is properly handled for each Select component
  const ensureValidValue = (value: string | undefined): string => {
    return value || "default-value"; // Provide a default non-empty value
  };

  const handleAddPayment = async (data: Partial<Payment>) => {
    try {
      const paymentCollection = collection(db, COLLECTIONS.ACCOUNTING.PAYMENTS);
      await addDoc(paymentCollection, {
        ...data,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Paiement ajouté",
        description: "Le paiement a été ajouté avec succès",
      });
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du paiement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comptabilité Transport</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSummaryDialog(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Récapitulatif
          </Button>
          <Button onClick={() => setShowAddPaymentDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="invoices">Factures</TabsTrigger>
              <TabsTrigger value="payments">Paiements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invoices">
              <InvoicesTable 
                invoices={invoices} 
                isLoading={isLoadingInvoices}
                onView={(id) => console.log("View invoice", id)}
                onEdit={(id) => console.log("Edit invoice", id)}
                onDelete={(id) => console.log("Delete invoice", id)}
              />
            </TabsContent>
            
            <TabsContent value="payments">
              {isLoadingPayments ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              ) : payments?.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  Aucun paiement trouvé
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Facture</th>
                        <th className="text-left p-3 font-medium">Client</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Montant</th>
                        <th className="text-left p-3 font-medium">Statut</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments?.map((payment) => (
                        <tr key={payment.id} className="border-t">
                          <td className="p-3">{payment.invoiceNumber}</td>
                          <td className="p-3">{payment.clientName}</td>
                          <td className="p-3">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="p-3">{payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: payment.currency || 'EUR' })}</td>
                          <td className="p-3">
                            <span className={`rounded-full px-2 py-1 text-xs 
                              ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {payment.status === 'completed' ? 'Complété' : 
                               payment.status === 'pending' ? 'En attente' : 'Échoué'}
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm" onClick={() => console.log('View payment', payment.id)}>
                              Voir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FreightAccountingSummaryDialog 
        open={showSummaryDialog} 
        onOpenChange={setShowSummaryDialog}
        shipments={[]} 
        clients={[]} 
        containers={[]}
      />

      <PaymentFormDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        onSubmit={handleAddPayment}
      />
    </div>
  );
};

export default FreightAccountingPage;
