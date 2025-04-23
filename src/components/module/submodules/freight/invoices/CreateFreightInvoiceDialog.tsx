
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFreightShipments } from '@/hooks/freight/useFreightShipments';
import { useContainersData } from '@/hooks/modules/useContainersData';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateFreightInvoiceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateFreightInvoiceDialogProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    amount: 0,
    shipmentReference: 'none',
    containerNumber: 'none',
    status: 'pending',
    currency: 'EUR',
    invoiceNumber: `INV-${new Date().getTime().toString().slice(-6)}`,
  });

  const { shipments } = useFreightShipments();
  const { containers } = useContainersData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If it's a shipment selection, update the client name
    if (name === 'shipmentReference' && value !== 'none') {
      const selectedShipment = shipments.find((s) => s.reference === value);
      if (selectedShipment) {
        setFormData((prev) => ({
          ...prev,
          clientName: selectedShipment.customerName || '',
        }));
      }
    }

    // If it's a container selection, update the client name
    if (name === 'containerNumber' && value !== 'none') {
      const selectedContainer = containers.find((c) => c.number === value);
      if (selectedContainer) {
        setFormData((prev) => ({
          ...prev,
          clientName: selectedContainer.client || '',
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare the invoice data, ensuring no undefined values
      const invoiceData = {
        clientName: formData.clientName || '',
        amount: formData.amount || 0,
        shipmentReference: formData.shipmentReference === 'none' ? null : formData.shipmentReference,
        containerNumber: formData.containerNumber === 'none' ? null : formData.containerNumber,
        status: formData.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        invoiceNumber: formData.invoiceNumber || `INV-${new Date().getTime().toString().slice(-6)}`,
        currency: formData.currency || 'EUR',
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.BILLING), invoiceData);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error(`Erreur lors de la création de la facture: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Numéro de facture</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une devise" />
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
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="shipmentReference">Référence Expédition</Label>
              <Select 
                value={formData.shipmentReference}
                onValueChange={(value) => handleSelectChange('shipmentReference', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une expédition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.reference}>
                      {shipment.reference} - {shipment.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="containerNumber">Numéro de Conteneur</Label>
              <Select
                value={formData.containerNumber}
                onValueChange={(value) => handleSelectChange('containerNumber', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un conteneur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {containers.map((container) => (
                    <SelectItem key={container.id} value={container.number}>
                      {container.number} - {container.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
