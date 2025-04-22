
import React, { useState } from 'react';
import { useFreightData } from '@/hooks/modules/useFreightData';
import { InvoicesTable } from '@/components/module/submodules/accounting/components/InvoicesTable';
import { useAccountingData } from '@/hooks/modules/useAccountingData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateFreightInvoiceDialog } from './CreateFreightInvoiceDialog';
import { ViewFreightInvoiceDialog } from './ViewFreightInvoiceDialog';
import { EditFreightInvoiceDialog } from './EditFreightInvoiceDialog';
import { DeleteFreightInvoiceDialog } from './DeleteFreightInvoiceDialog';
import { PayFreightInvoiceDialog } from './PayFreightInvoiceDialog';
import { toast } from 'sonner';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FreightAccountingPage = () => {
  const { containers, shipments, clients } = useFreightData();
  const { invoices, isLoading } = useAccountingData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState(false);

  // Filter and format invoices to include container and shipment info
  const enrichedInvoices = React.useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) {
      console.log("No invoices data available:", invoices);
      return [];
    }
    
    return invoices.map(invoice => {
      const container = containers?.find(c => c.number === invoice.containerReference);
      const shipment = shipments?.find(s => s.reference === invoice.shipmentReference);
      const client = clients?.find(c => c.id === invoice.clientId);

      return {
        ...invoice,
        clientName: client?.name || invoice.clientName || container?.client || shipment?.customer || 'Inconnu',
        containerCost: container?.costs?.[0]?.amount || 0,
        shipmentStatus: shipment?.status || ''
      };
    });
  }, [invoices, containers, shipments, clients]);

  const handleCreateInvoice = async (data: any) => {
    try {
      const invoiceData = {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending',
        invoiceNumber: `FT-${Date.now()}`,
      };

      await addDoc(collection(db, 'freight_billing'), invoiceData);
      toast.success('Facture créée avec succès');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  const handleViewInvoice = (id: string) => {
    const invoice = enrichedInvoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowViewDialog(true);
    }
  };

  const handleEditInvoice = (id: string) => {
    const invoice = enrichedInvoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowEditDialog(true);
    }
  };

  const handleUpdateInvoice = async (updatedData: any) => {
    try {
      if (!selectedInvoice?.id) return;
      
      const invoiceRef = doc(db, 'freight_billing', selectedInvoice.id);
      await updateDoc(invoiceRef, updatedData);
      
      toast.success('Facture mise à jour avec succès');
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
    }
  };

  const handleDeleteInvoice = (id: string) => {
    const invoice = enrichedInvoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedInvoice?.id) return;
      
      await deleteDoc(doc(db, 'freight_billing', selectedInvoice.id));
      
      toast.success('Facture supprimée avec succès');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression de la facture');
    }
  };

  const handlePayInvoice = (id: string) => {
    const invoice = enrichedInvoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowPayDialog(true);
    }
  };

  const handleProcessPayment = async (paymentData: any) => {
    try {
      if (!selectedInvoice?.id) return;
      
      // Update invoice status to paid
      const invoiceRef = doc(db, 'freight_billing', selectedInvoice.id);
      await updateDoc(invoiceRef, {
        status: 'paid',
        paymentMethod: paymentData.method,
        paymentDate: new Date().toISOString(),
        paymentReference: paymentData.reference || ''
      });
      
      toast.success('Paiement enregistré avec succès');
      setShowPayDialog(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Erreur lors du traitement du paiement');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures Transport</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement des factures...</p>
        </div>
      ) : enrichedInvoices.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Aucune facture trouvée</h3>
          <p className="text-gray-500 mb-4">Créez une nouvelle facture pour commencer</p>
          <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      ) : (
        <InvoicesTable 
          invoices={enrichedInvoices}
          isLoading={isLoading}
          onView={handleViewInvoice}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onPay={handlePayInvoice}
        />
      )}

      <CreateFreightInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateInvoice}
      />
      
      {selectedInvoice && (
        <>
          <ViewFreightInvoiceDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            invoice={selectedInvoice}
          />
          
          <EditFreightInvoiceDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            invoice={selectedInvoice}
            onSubmit={handleUpdateInvoice}
          />
          
          <DeleteFreightInvoiceDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            invoice={selectedInvoice}
            onConfirmDelete={handleConfirmDelete}
          />
          
          <PayFreightInvoiceDialog
            open={showPayDialog}
            onOpenChange={setShowPayDialog}
            invoice={selectedInvoice}
            onSubmit={handleProcessPayment}
          />
        </>
      )}
    </div>
  );
};

export default FreightAccountingPage;
