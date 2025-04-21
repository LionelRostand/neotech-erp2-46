
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from '../../clients/hooks/useClients';
import { useShipments } from '../../shipments/hooks/useShipments';
import { useContainers } from '../../containers/hooks/useContainers';
import { PaymentMethod, PaymentType, FreightPayment } from '../../types/freight-types';
import { toast } from "sonner";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentCreated: () => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({ 
  open, 
  onOpenChange,
  onPaymentCreated 
}) => {
  const [clientId, setClientId] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('shipment');
  const [referenceId, setReferenceId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  
  const { clients, isLoading: isLoadingClients } = useClients();
  const { shipments, isLoading: isLoadingShipments } = useShipments();
  const { containers, isLoading: isLoadingContainers } = useContainers();

  // Filtered lists
  const filteredShipments = shipments.filter(s => !clientId || s.customer === clientId);
  const filteredContainers = containers.filter(c => !clientId || c.client === clientId);

  // Reset reference when client or type changes
  useEffect(() => {
    setReferenceId('');
  }, [clientId, paymentType]);

  // Auto-set amount when reference is selected
  useEffect(() => {
    if (!referenceId) {
      setAmount('');
      return;
    }

    if (paymentType === 'shipment') {
      const shipment = shipments.find(s => s.id === referenceId);
      if (shipment && shipment.cost) {
        setAmount(shipment.cost);
      }
    } else {
      const container = containers.find(c => c.id === referenceId);
      if (container && container.cost) {
        setAmount(container.cost);
      }
    }
  }, [referenceId, paymentType, shipments, containers]);

  const handleSubmit = () => {
    if (!clientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    if (!referenceId) {
      toast.error("Veuillez sélectionner une référence");
      return;
    }

    if (!amount) {
      toast.error("Veuillez entrer un montant");
      return;
    }

    // In a real application, we would save this to the database
    const client = clients.find(c => c.id === clientId);
    const reference = paymentType === 'shipment' 
      ? shipments.find(s => s.id === referenceId)?.reference 
      : containers.find(c => c.id === referenceId)?.number;

    const newPayment: FreightPayment = {
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
      clientId,
      clientName: client?.name || '',
      referenceId,
      reference: reference || '',
      type: paymentType,
      amount: Number(amount),
      method,
      status: 'completed',
      invoiceNumber: `INV-${Date.now()}`, // This would be generated properly in a real app
      transactionId: transactionId,
      notes,
    };

    console.log('Creating payment:', newPayment);
    
    // Reset form
    setClientId('');
    setPaymentType('shipment');
    setReferenceId('');
    setAmount('');
    setMethod('card');
    setTransactionId('');
    setNotes('');
    
    // Close dialog
    onOpenChange(false);
    onPaymentCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              value={clientId}
              onValueChange={setClientId}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="type-shipment"
                  value="shipment"
                  checked={paymentType === 'shipment'}
                  onChange={() => setPaymentType('shipment')}
                  className="mr-2"
                />
                <Label htmlFor="type-shipment">Expédition</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="type-container"
                  value="container"
                  checked={paymentType === 'container'} 
                  onChange={() => setPaymentType('container')}
                  className="mr-2"
                />
                <Label htmlFor="type-container">Conteneur</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Référence</Label>
            <Select
              value={referenceId}
              onValueChange={setReferenceId}
              disabled={!clientId}
            >
              <SelectTrigger id="reference">
                <SelectValue placeholder={`Sélectionner une ${paymentType === 'shipment' ? 'expédition' : 'conteneur'}`} />
              </SelectTrigger>
              <SelectContent>
                {paymentType === 'shipment' ? (
                  filteredShipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.reference} - {shipment.origin} → {shipment.destination}
                    </SelectItem>
                  ))
                ) : (
                  filteredContainers.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      {container.number} - {container.origin} → {container.destination}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select
              value={method}
              onValueChange={(value) => setMethod(value as PaymentMethod)}
            >
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionner une méthode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(method === 'card' || method === 'paypal') && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de transaction</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Ex: TXN123456789"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes additionnelles"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
