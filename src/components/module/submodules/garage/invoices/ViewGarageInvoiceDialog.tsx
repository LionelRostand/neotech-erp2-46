import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGarageLoyalty } from '@/hooks/garage/useGarageLoyalty';
import { toast } from 'sonner';

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
  const [selectedLoyalty, setSelectedLoyalty] = useState<string>("none");
  const { activePrograms } = useGarageLoyalty();

  const [discountedAmount, setDiscountedAmount] = useState(invoice?.amount || 0);

  const handleLoyaltyChange = (programId: string) => {
    setSelectedLoyalty(programId);
    if (programId === "none") {
      setDiscountedAmount(invoice.amount);
      return;
    }
    
    const program = activePrograms.find(p => p.id === programId);
    if (program) {
      const discount = invoice.amount * (program.pointsMultiplier - 1) / program.pointsMultiplier;
      setDiscountedAmount(invoice.amount - discount);
    } else {
      setDiscountedAmount(invoice.amount);
    }
  };

  const generateReceipt = (paymentMethod: string) => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const text = "Reçu de Paiement";
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;

    doc.text(text, x, 10);
    doc.line(10, 12, pageWidth - 10, 12);

    doc.setFontSize(10);
    doc.text(`Facture N°: ${invoice.id}`, 10, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 25);
    doc.text(`Méthode de paiement: ${paymentMethod}`, 10, 30);
    doc.text(`Client: ${invoice.clientName}`, 10, 35);
    doc.text(`Montant total: ${formatCurrency(invoice.amount)}`, 10, 40);

    if (selectedLoyalty !== "none") {
      const program = activePrograms.find(p => p.id === selectedLoyalty);
      if (program) {
        doc.text(`Programme de fidélité appliqué: ${program.name}`, 10, 45);
        doc.text(`Montant réduit: ${formatCurrency(discountedAmount)}`, 10, 50);
      }
    }
    
    doc.save(`receipt-${invoice.id}.pdf`);
  };

  const handleProcessPayment = async (paymentMethod: string) => {
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate receipt
      generateReceipt(paymentMethod);
      
      toast.success("Paiement effectué avec succès");
      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du traitement du paiement");
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (!invoice) return null;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Facture N°:</span>
            <span>{invoice.id}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Client:</span>
            <span>{invoice.clientName}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span>{getStatusBadge(invoice.status)}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span>{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Échéance:</span>
            <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>

          {invoice.status !== 'paid' && (
            <div>
              <p className="font-medium mb-1">Programme de Fidélité</p>
              <Select
                value={selectedLoyalty}
                onValueChange={handleLoyaltyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun programme</SelectItem>
                  {activePrograms.map(program => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} (-{((program.pointsMultiplier - 1) / program.pointsMultiplier * 100).toFixed(0)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <p className="font-medium mb-1">Montant</p>
            <div className="space-y-1">
              {selectedLoyalty !== "none" && discountedAmount !== invoice.amount && (
                <p className="text-sm line-through text-gray-500">
                  {formatCurrency(invoice.amount)}
                </p>
              )}
              <p className="text-lg font-bold">
                {formatCurrency(discountedAmount)}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="space-x-2">
          {invoice.status !== 'paid' && (
            <>
              <Button 
                onClick={() => handleProcessPayment('card')}
                disabled={processingPayment}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {processingPayment ? 'Traitement...' : 'Payer par carte'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewGarageInvoiceDialog;
