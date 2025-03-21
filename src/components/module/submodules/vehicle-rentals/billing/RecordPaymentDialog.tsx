
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, CreditCard, Receipt } from "lucide-react";
import { toast } from 'sonner';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock invoice data
const mockInvoices = [
  { id: '1', number: 'FACT-2023-0002', client: 'Sophie Durand', amount: 1250 },
  { id: '2', number: 'FACT-2023-0003', client: 'Entreprise ABC', amount: 2150 },
  { id: '3', number: 'FACT-2023-0004', client: 'Jean Lefebvre', amount: 950 },
  { id: '4', number: 'FACT-2023-0005', client: 'Marie Robert', amount: 1680 },
];

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({ open, onOpenChange }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionId, setTransactionId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Get selected invoice amount
  const getInvoiceAmount = () => {
    const invoice = mockInvoices.find(inv => inv.id === selectedInvoice);
    return invoice ? invoice.amount : 0;
  };

  // Handle invoice selection
  const handleInvoiceSelection = (id: string) => {
    setSelectedInvoice(id);
    const invoice = mockInvoices.find(inv => inv.id === id);
    if (invoice) {
      setAmount(invoice.amount);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedInvoice) {
      toast.error("Veuillez sélectionner une facture");
      return;
    }

    if (!paymentMethod) {
      toast.error("Veuillez sélectionner une méthode de paiement");
      return;
    }

    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à 0");
      return;
    }

    console.log('Recording payment:', {
      invoiceId: selectedInvoice,
      method: paymentMethod,
      amount,
      date: paymentDate,
      transactionId,
      notes
    });
    
    toast.success("Paiement enregistré avec succès");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invoice">Facture</Label>
            <Select value={selectedInvoice} onValueChange={handleInvoiceSelection}>
              <SelectTrigger id="invoice">
                <SelectValue placeholder="Sélectionner une facture" />
              </SelectTrigger>
              <SelectContent>
                {mockInvoices.map(invoice => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.number} - {invoice.client} ({invoice.amount.toLocaleString('fr-FR')} €)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input 
              id="amount" 
              type="number" 
              min="0" 
              step="0.01" 
              value={amount || ''} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="stripe">Carte bancaire (Stripe)</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(paymentMethod === 'stripe' || paymentMethod === 'paypal') && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de transaction</Label>
              <Input 
                id="transactionId" 
                placeholder="Ex: ch_123456789" 
                value={transactionId} 
                onChange={(e) => setTransactionId(e.target.value)} 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input 
              id="notes" 
              placeholder="Notes additionnelles" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <Receipt className="mr-2 h-4 w-4" /> Enregistrer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
