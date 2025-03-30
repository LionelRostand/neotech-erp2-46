
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/patched-select";
import { Textarea } from "@/components/ui/textarea";
import { Check, CreditCard, Receipt, Landmark, X } from "lucide-react";
import { toast } from "sonner";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any | null;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  open,
  onOpenChange,
  invoice
}) => {
  const [amount, setAmount] = useState(invoice ? invoice.amount.toString() : '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Le montant doit être supérieur à zéro");
      return;
    }

    // In a real application, this would save the payment to the database
    toast.success("Paiement enregistré avec succès");
    onOpenChange(false);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'transfer':
        return <Landmark className="h-4 w-4 mr-2" />;
      case 'cash':
      case 'check':
        return <Receipt className="h-4 w-4 mr-2" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };

  if (!invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
            <div>
              <div className="font-medium">{invoice.number}</div>
              <div className="text-sm text-muted-foreground">{invoice.clientName}</div>
            </div>
            <div className="font-bold">{formatCurrency(invoice.amount)}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Carte bancaire</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center">
                    <Landmark className="h-4 w-4 mr-2" />
                    <span>Virement bancaire</span>
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    <span>Espèces</span>
                  </div>
                </SelectItem>
                <SelectItem value="check">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    <span>Chèque</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date du paiement</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              placeholder="Numéro de transaction, référence..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Notes additionnelles sur le paiement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
