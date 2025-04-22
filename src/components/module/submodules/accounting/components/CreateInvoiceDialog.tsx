
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Container, Shipment } from '@/types/freight';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceDialogProps) => {
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState<number>(0);

  // Fetch containers
  const { data: containers = [] } = useQuery({
    queryKey: ['containers'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CONTAINERS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Container[];
    }
  });

  // Fetch shipments
  const { data: shipments = [] } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shipment[];
    }
  });

  // Update client and amount when container or shipment changes
  useEffect(() => {
    const container = containers.find(c => c.number === selectedContainer);
    const shipment = shipments.find(s => s.reference === selectedShipment);
    
    if (container) {
      setClientName(container.client || '');
      // Si le conteneur a des coûts, utiliser le premier
      const containerCost = container.costs?.[0]?.amount || 0;
      setAmount(containerCost);
    } else if (shipment) {
      setClientName(shipment.customer || '');
      setAmount(shipment.totalPrice || 0);
    }
  }, [selectedContainer, selectedShipment, containers, shipments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ajouter la logique de création de facture ici
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Numéro de conteneur</Label>
            <Select value={selectedContainer} onValueChange={setSelectedContainer}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                {containers.map(container => (
                  <SelectItem
                    key={container.id}
                    value={container.number}
                  >
                    {container.number} ({container.client})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Référence expédition</Label>
            <Select value={selectedShipment} onValueChange={setSelectedShipment}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une expédition" />
              </SelectTrigger>
              <SelectContent>
                {shipments.map(shipment => (
                  <SelectItem
                    key={shipment.id}
                    value={shipment.reference}
                  >
                    {shipment.reference} ({shipment.customer})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={clientName} disabled />
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

export default CreateInvoiceDialog;
