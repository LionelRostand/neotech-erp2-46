
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
import { Container, Shipment } from '@/types/freight';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceDialogProps) => {
  const [selectedContainer, setSelectedContainer] = useState<string>('none');
  const [selectedShipment, setSelectedShipment] = useState<string>('none');
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
    // Only proceed if selection is not "none"
    if (selectedContainer !== 'none') {
      const container = containers.find(c => c.number === selectedContainer);
      if (container) {
        setClientName(container.client || '');
        const containerCost = container.costs?.[0]?.amount || 0;
        setAmount(containerCost);
      }
    } else if (selectedShipment !== 'none') {
      const shipment = shipments.find(s => s.reference === selectedShipment);
      if (shipment) {
        setClientName(shipment.customer || '');
        setAmount(shipment.totalPrice || 0);
      }
    }
  }, [selectedContainer, selectedShipment, containers, shipments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ajouter la logique de création de facture ici
    onOpenChange(false);
  };

  // Generate a unique placeholder value for empty values that's NOT an empty string
  const getPlaceholderValue = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

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
                  <>
                    <SelectItem value="none">Aucun</SelectItem>
                    {containers.map(container => (
                      <SelectItem
                        key={container.id}
                        value={container.number || `container-${container.id}`}
                      >
                        {container.number || 'Sans numéro'} ({container.client || 'Sans client'})
                      </SelectItem>
                    ))}
                  </>
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
                  <SelectItem value="loading-shipments">Chargement...</SelectItem>
                ) : shipments.length === 0 ? (
                  <SelectItem value="no-shipments">Aucune expédition disponible</SelectItem>
                ) : (
                  <>
                    <SelectItem value="none">Aucun</SelectItem>
                    {shipments.map(shipment => (
                      <SelectItem
                        key={shipment.id}
                        value={shipment.reference || `shipment-${shipment.id}`}
                      >
                        {shipment.reference || 'Sans référence'} ({shipment.customer || 'Sans client'})
                      </SelectItem>
                    ))}
                  </>
                )}
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
