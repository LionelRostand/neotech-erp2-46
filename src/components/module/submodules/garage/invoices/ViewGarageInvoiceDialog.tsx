import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, paypal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/lib/utils';
import { jsPDF } from 'jspdf';

interface ViewGarageInvoiceDialogProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const ViewGarageInvoiceDialog = ({ 
  invoice, 
  isOpen, 
  onClose,
  onPaymentComplete 
}: ViewGarageInvoiceDialogProps) => {
  const [processingPayment, setProcessingPayment] = useState(false);

  const generateReceipt = (paymentMethod: string) => {
    const doc = new jsPDF();
    
    // Add garage info
    doc.setFontSize(20);
    doc.text('Garage Auto Service', 20, 20);
    
    // Add receipt details
    doc.setFontSize(12);
    doc.text('REÇU DE PAIEMENT', 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`N° Facture: ${invoice.invoiceNumber}`, 20, 60);
    doc.text(`Client: ${invoice.clientName}`, 20, 70);
    doc.text(`Service: ${invoice.vehicleInfo || 'Maintenance véhicule'}`, 20, 80);
    doc.text(`Montant payé: ${formatCurrency(invoice.amount)}`, 20, 90);
    doc.text(`Mode de paiement: ${paymentMethod}`, 20, 100);
    
    // Save the PDF
    doc.save(`recu-${invoice.invoiceNumber}.pdf`);
  };

  const handlePayment = async (method: string) => {
    try {
      setProcessingPayment(true);
      // Generate receipt with payment method
      generateReceipt(method);
      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">Numéro</p>
              <p>{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Status</p>
              <Badge variant={invoice.status === 'paid' ? 'success' : 'secondary'}>
                {invoice.status === 'paid' ? 'Payée' : 'En attente'}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-1">Client</p>
            <p>{invoice.clientName}</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Véhicule</p>
            <p>{invoice.vehicleInfo || 'Non spécifié'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">Date</p>
              <p>{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Échéance</p>
              <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-1">Montant</p>
            <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => handlePayment('Virement bancaire')}
              disabled={processingPayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Virement bancaire
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePayment('PayPal')}
              disabled={processingPayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              PayPal
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewGarageInvoiceDialog;
