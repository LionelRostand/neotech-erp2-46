
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shipment {
  id: string;
  reference: string;
  customer: string;
  clientName?: string;
  customerName?: string;
  origin: string;
  destination: string;
}

interface Container {
  id: string;
  number: string;
  client: string;
  clientName?: string;
  costs?: Array<{
    amount: number;
    description?: string;
  }>;
}

export function CreateFreightInvoiceDialog({
  open,
  onOpenChange,
}: CreateFreightInvoiceDialogProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now().toString().substring(5)}`,
    clientName: '',
    amount: '',
    currency: 'EUR',
    shipmentReference: '',
    containerReference: '',
    notes: '',
    status: 'pending',
  });

  const { data: shipments = [] } = useQuery({
    queryKey: ['freight', 'shipments'],
    queryFn: () => fetchCollectionData<Shipment>(COLLECTIONS.FREIGHT.SHIPMENTS),
  });

  const { data: containers = [] } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: () => fetchCollectionData<Container>(COLLECTIONS.FREIGHT.CONTAINERS),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-populate client name and amount based on selection
    if (name === 'shipmentReference' && value) {
      const selectedShipment = shipments.find((s) => s.reference === value);
      if (selectedShipment) {
        setFormData((prev) => ({
          ...prev,
          clientName: selectedShipment.customerName || selectedShipment.customer || '',
        }));
      }
    } else if (name === 'containerReference' && value) {
      const selectedContainer = containers.find((c) => c.number === value);
      if (selectedContainer) {
        const containerCost = selectedContainer.costs?.[0]?.amount || 0;
        setFormData((prev) => ({
          ...prev,
          clientName: selectedContainer.clientName || selectedContainer.client || '',
          amount: containerCost.toString(),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName) {
      toast.error('Veuillez spécifier un client');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Veuillez spécifier un montant valide');
      return;
    }
    
    try {
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, COLLECTIONS.FREIGHT.BILLING), invoiceData);
      toast.success('Facture créée avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="shipmentReference">Référence Colis</Label>
              <Select
                value={formData.shipmentReference || 'no-selection'}
                onValueChange={(value) => handleSelectChange('shipmentReference', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un colis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-selection">Aucun colis</SelectItem>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.reference}>
                      {shipment.reference} - {shipment.origin} à {shipment.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="containerReference">Référence Conteneur</Label>
              <Select
                value={formData.containerReference || 'no-selection'}
                onValueChange={(value) => handleSelectChange('containerReference', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un conteneur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-selection">Aucun conteneur</SelectItem>
                  {containers.map((container) => (
                    <SelectItem key={container.id} value={container.number}>
                      {container.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Montant</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notes ou commentaires sur la facture..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer la facture</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
