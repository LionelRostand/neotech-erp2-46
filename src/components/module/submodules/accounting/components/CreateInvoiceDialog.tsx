
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container, Shipment } from '@/types/freight';
import { toast } from 'sonner';

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
  const { data: containers = [], isLoading: containersLoading } = useQuery({
    queryKey: ['containers'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CONTAINERS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Container[];
    }
  });

  // Fetch shipments
  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery({
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
      const containerCost = container.costs?.[0]?.amount || 0;
      setAmount(containerCost);
    } else if (shipment) {
      setClientName(shipment.customer || '');
      setAmount(shipment.totalPrice || 0);
    }
  }, [selectedContainer, selectedShipment, containers, shipments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare invoice data
      const invoiceData = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total: amount,
        status: 'pending',
        currency: 'EUR',
        containerReference: selectedContainer || '',
        shipmentReference: selectedShipment || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to Firestore
      await addDoc(collection(db, COLLECTIONS.ACCOUNTING.INVOICES), invoiceData);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error("Erreur lors de la création de la facture");
    }
  };

  // Helper function to ensure we never have empty values for SelectItem
  const ensureValidValue = (value: string | undefined | null): string => {
    return value ? value : `no-value-${Math.random().toString(36).substring(2, 9)}`;
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
                {containersLoading ? (
                  <SelectItem value="loading">Chargement...</SelectItem>
                ) : containers.length === 0 ? (
                  <SelectItem value="no-containers">Aucun conteneur disponible</SelectItem>
                ) : (
                  containers.map(container => (
                    <SelectItem
                      key={container.id}
                      value={ensureValidValue(container.number)}
                    >
                      {container.number || 'Sans numéro'} ({container.client || 'Sans client'})
                    </SelectItem>
                  ))
                )}
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
                {shipmentsLoading ? (
                  <SelectItem value="loading">Chargement...</SelectItem>
                ) : shipments.length === 0 ? (
                  <SelectItem value="no-shipments">Aucune expédition disponible</SelectItem>
                ) : (
                  shipments.map(shipment => (
                    <SelectItem
                      key={shipment.id}
                      value={ensureValidValue(shipment.reference)}
                    >
                      {shipment.reference || 'Sans référence'} ({shipment.customer || 'Sans client'})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
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
