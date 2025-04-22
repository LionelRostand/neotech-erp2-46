
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useFreightData } from '@/hooks/modules/useFreightData';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFreightInvoiceDialog = ({
  open,
  onOpenChange,
}: CreateFreightInvoiceDialogProps) => {
  const { shipments, containers } = useFreightData();
  const firestore = useFirestore(COLLECTIONS.FREIGHT.BILLING);
  
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (selectedShipment || selectedContainer) {
      const shipment = shipments.find(s => s.reference === selectedShipment);
      const container = containers.find(c => c.number === selectedContainer);
      
      if (shipment) {
        setClientName(shipment.customer || '');
        setAmount(shipment.totalPrice || 0);
      } else if (container) {
        setClientName(container.client || '');
        setAmount(container.costs?.[0]?.amount || 0);
      }
    }
  }, [selectedShipment, selectedContainer, shipments, containers]);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setSelectedShipment('');
      setSelectedContainer('');
      setClientName('');
      setAmount(0);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!clientName || amount <= 0) {
        toast.error("Veuillez remplir tous les champs requis");
        return;
      }

      const invoiceData = {
        clientName,
        amount,
        shipmentReference: selectedShipment || null,
        containerNumber: selectedContainer || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await firestore.add(invoiceData);
      toast.success('Facture créée avec succès');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error("Erreur lors de la création de la facture");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Référence expédition</Label>
            <Select value={selectedShipment} onValueChange={(value) => {
              setSelectedShipment(value);
              setSelectedContainer(''); // Clear container when shipment is selected
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une expédition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune</SelectItem>
                {shipments.map(shipment => (
                  <SelectItem key={shipment.id} value={shipment.reference}>
                    {shipment.reference} ({shipment.customer})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Numéro de conteneur</Label>
            <Select value={selectedContainer} onValueChange={(value) => {
              setSelectedContainer(value);
              setSelectedShipment(''); // Clear shipment when container is selected
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {containers.map(container => (
                  <SelectItem key={container.id} value={container.number}>
                    {container.number} ({container.client})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Input 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Montant</Label>
            <Input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFreightInvoiceDialog;
