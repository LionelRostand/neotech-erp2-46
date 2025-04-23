
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

interface Shipment {
  id: string;
  reference: string;
  customer: string;
  customerName?: string;
  totalPrice?: number;
}

interface Container {
  id: string;
  number: string;
  client: string;
  costs?: Array<{ amount: number; currency?: string }>;
}

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFreightInvoiceDialog: React.FC<CreateFreightInvoiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [formData, setFormData] = useState<{
    shipmentReference: string;
    containerId: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    currency: string;
  }>({
    shipmentReference: '',
    containerId: '',
    invoiceNumber: '',
    clientName: '',
    amount: 0,
    currency: 'EUR',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger Shipments et Containers
  useEffect(() => {
    async function fetchShipments() {
      try {
        const snap = await db.collection(COLLECTIONS.FREIGHT.SHIPMENTS).get();
        setShipments(
          snap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (e) {
        toast.error("Erreur lors du chargement des colis");
      }
    }
    async function fetchContainers() {
      try {
        const snap = await db.collection(COLLECTIONS.FREIGHT.CONTAINERS).get();
        setContainers(
          snap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (e) {
        toast.error("Erreur lors du chargement des conteneurs");
      }
    }
    if (open) {
      fetchShipments();
      fetchContainers();
    }
  }, [open]);

  // Actualiser le client et le prix selon la sélection
  useEffect(() => {
    const selectedShipment = shipments.find((s) => s.id === formData.shipmentReference);
    if (selectedShipment) {
      setFormData((prev) => ({
        ...prev,
        clientName: selectedShipment.customerName || '',
        amount: selectedShipment.totalPrice ?? 0,
        currency: 'EUR' // ou la currency du shipment si dispo
      }));
    }
    const selectedContainer = containers.find((c) => c.id === formData.containerId);
    if (selectedContainer) {
      setFormData((prev) => ({
        ...prev,
        clientName: selectedContainer.client || prev.clientName,
        amount: selectedContainer.costs?.[0]?.amount ?? prev.amount,
        currency: selectedContainer.costs?.[0]?.currency ?? 'EUR'
      }));
    }
  }, [formData.shipmentReference, formData.containerId, shipments, containers]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Préparation des datas
      const { shipmentReference, containerId, invoiceNumber, clientName, amount, currency } = formData;

      // Si un shipment est choisi -> la facture portera la ref + montant du shipment
      // Si un container est choisi -> la facture portera la ref + montant du container
      // NB : On empêche les champs undefined
      const shipment = shipments.find((s) => s.id === shipmentReference);
      const container = containers.find((c) => c.id === containerId);
      const dataToSave: any = {
        invoiceNumber,
        clientName,
        amount,
        currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (shipment) {
        dataToSave.shipmentReference = shipment.reference;
      }
      if (container) {
        dataToSave.containerNumber = container.number;
      }
      // Ajout Firestore
      await addDoc(collection(db, COLLECTIONS.FREIGHT.BILLING), dataToSave);

      toast.success('Facture créée !');
      onOpenChange(false);
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Erreur lors de la création de la facture');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle facture (colis/conteneur)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div>
              <Label htmlFor="shipmentReference">Colis (expédition)</Label>
              <Select
                value={formData.shipmentReference}
                onValueChange={(value) => handleChange('shipmentReference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un colis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-</SelectItem>
                  {shipments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.reference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="containerId">Conteneur</Label>
              <Select
                value={formData.containerId}
                onValueChange={(value) => handleChange('containerId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un conteneur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-</SelectItem>
                  {containers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoiceNumber">N° Facture</Label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                placeholder="Numéro de facture"
              />
            </div>
            <div>
              <Label>Client</Label>
              <Input value={formData.clientName} disabled />
            </div>
            <div>
              <Label>Montant</Label>
              <Input value={formData.amount} disabled />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button disabled={isSubmitting} type="submit">
              Créer la facture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFreightInvoiceDialog;
