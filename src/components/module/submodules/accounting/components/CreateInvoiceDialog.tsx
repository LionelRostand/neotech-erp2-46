
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
import { toast } from 'sonner';
import { Invoice } from '../types/accounting-types';
import { Container, Shipment } from '@/types/freight';

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
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
    paymentMethod: 'card'
  });

  const { containers, isLoading: containersLoading } = useContainersData();
  const { data: shipments, isLoading: shipmentsLoading } = useCollectionData<Shipment>(
    COLLECTIONS.FREIGHT.SHIPMENTS
  );

  useEffect(() => {
    if (selectedShipment && containers && shipments) {
      const shipment = shipments.find(s => s.reference === selectedShipment);
      const container = containers.find(c => c.number === shipment?.reference);
      
      if (shipment && container) {
        const containerCost = container.costs?.[0]?.amount || 0;
        
        setInvoiceData({
          containerReference: container.number,
          containerCost: containerCost,
          clientName: shipment.customer || container.client || 'Client non spécifié',
          shipmentReference: shipment.reference,
          shipmentStatus: shipment.status,
          total: containerCost,
          currency: 'EUR',
          status: 'pending',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentMethod: selectedPaymentMethod
        });
      }
    }
  }, [selectedShipment, containers, shipments, selectedPaymentMethod]);

  const handleSubmit = () => {
    if (!selectedShipment) {
      toast.error('Veuillez sélectionner une expédition');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement');
      return;
    }
    onSubmit(invoiceData);
    onOpenChange(false);
  };

  const getShipmentLabel = (shipment: Shipment): string => {
    return `${shipment.reference} - ${shipment.customer || 'Client non spécifié'}`;
  };

  const hasValidShipments = shipments && shipments.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Expédition</Label>
            <Select
              value={selectedShipment}
              onValueChange={setSelectedShipment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une expédition" />
              </SelectTrigger>
              <SelectContent>
                {hasValidShipments ? (
                  shipments.map((shipment) => (
                    <SelectItem 
                      key={shipment.id} 
                      value={shipment.reference}
                    >
                      {getShipmentLabel(shipment)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-shipments">Aucune expédition disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedShipment && (
            <>
              <div className="space-y-2">
                <Label>Client</Label>
                <Input value={invoiceData.clientName || ''} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>Coût</Label>
                <Input value={invoiceData.containerCost?.toString() || '0'} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Numéro de conteneur</Label>
                <Input value={invoiceData.containerReference || ''} readOnly />
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
