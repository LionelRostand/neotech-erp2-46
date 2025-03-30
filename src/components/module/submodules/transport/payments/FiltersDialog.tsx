
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
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
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({ open, onOpenChange, onApplyFilters }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleApply = () => {
    const filters = {
      dateFrom,
      dateTo,
      amount: amount ? parseFloat(amount) : null,
      clientName,
      paymentStatus,
      paymentMethod
    };
    
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setAmount('');
    setClientName('');
    setPaymentStatus('');
    setPaymentMethod('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrer les paiements</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input 
                id="dateFrom" 
                type="date" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input 
                id="dateTo" 
                type="date" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client</Label>
            <Input 
              id="clientName" 
              placeholder="Nom du client" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="Montant" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="partially_paid">Partiellement payée</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Toutes les méthodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement bancaire</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            <Button variant="outline" onClick={handleReset} type="button">
              <X className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleApply} type="button">
              <Check className="mr-2 h-4 w-4" />
              Appliquer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;
