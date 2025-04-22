
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFreightData } from '@/hooks/modules/useFreightData';
import { toast } from 'sonner';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const CreateFreightInvoiceDialog = ({ 
  open, 
  onOpenChange,
  onSubmit 
}: CreateFreightInvoiceDialogProps) => {
  const { containers, shipments } = useFreightData();
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedShipment, setSelectedShipment] = useState('');
  
  const handleSubmit = () => {
    const container = containers?.find(c => c.number === selectedContainer);
    const shipment = shipments?.find(s => s.reference === selectedShipment);
    
    if (!container && !shipment) {
      toast.error("Veuillez sélectionner un conteneur ou une expédition");
      return;
    }

    const invoiceData = {
      containerReference: selectedContainer,
      shipmentReference: selectedShipment,
      clientName: container?.client || shipment?.customer,
      containerCost: container?.costs?.[0]?.amount || 0,
      shipmentStatus: shipment?.status || '',
      date: new Date().toISOString(),
      status: 'pending'
    };

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
          <div>
            <Label htmlFor="container">Conteneur</Label>
            <Select 
              value={selectedContainer} 
              onValueChange={setSelectedContainer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                {containers?.map(container => (
                  <SelectItem key={container.number} value={container.number}>
                    {container.number} - {container.client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="shipment">Expédition</Label>
            <Select 
              value={selectedShipment} 
              onValueChange={setSelectedShipment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une expédition" />
              </SelectTrigger>
              <SelectContent>
                {shipments?.map(shipment => (
                  <SelectItem key={shipment.reference} value={shipment.reference}>
                    {shipment.reference} - {shipment.customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
