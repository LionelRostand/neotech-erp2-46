
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContainersData } from '@/hooks/modules/useContainersData';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container, Shipment } from '@/types/freight';
import { toast } from 'sonner';
import { Invoice } from '../types/accounting-types';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Invoice>) => void;
}

export const CreateInvoiceDialog = ({
  open,
  onOpenChange,
  onSubmit
}: CreateInvoiceDialogProps) => {
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({});

  const { containers, isLoading: containersLoading } = useContainersData();
  const { data: shipments, isLoading: shipmentsLoading } = useCollectionData(
    COLLECTIONS.FREIGHT.SHIPMENTS
  );

  useEffect(() => {
    if (selectedContainer && containers) {
      const container = containers.find(c => c.number === selectedContainer);
      const shipment = shipments?.find(s => s.reference === container?.number);
      
      if (container) {
        setInvoiceData({
          containerReference: container.number,
          containerCost: container.costs?.[0]?.amount || 0,
          clientName: container.client,
          shipmentReference: shipment?.reference || '',
          shipmentStatus: shipment?.status || '',
          total: container.costs?.[0]?.amount || 0,
          currency: 'EUR',
          status: 'pending',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentMethod: selectedPaymentMethod as any || undefined
        });
      }
    }
  }, [selectedContainer, containers, shipments, selectedPaymentMethod]);

  const handleSubmit = () => {
    if (!invoiceData.containerReference) {
      toast.error('Veuillez sélectionner un conteneur');
      return;
    }
    if (!invoiceData.paymentMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement');
      return;
    }
    onSubmit(invoiceData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Conteneur</Label>
            <Select
              value={selectedContainer}
              onValueChange={setSelectedContainer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                {containers?.map((container) => (
                  <SelectItem key={container.number} value={container.number}>
                    {container.number} - {container.client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedContainer && (
            <>
              <div className="space-y-2">
                <Label>Client</Label>
                <Input value={invoiceData.clientName} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>Coût</Label>
                <Input value={invoiceData.containerCost} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Référence expédition</Label>
                <Input value={invoiceData.shipmentReference} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Méthode de paiement</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="transfer">Virement</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
