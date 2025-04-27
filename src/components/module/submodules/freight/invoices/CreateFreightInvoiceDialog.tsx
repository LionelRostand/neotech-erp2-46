
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFreightShipments from '@/hooks/freight/useFreightShipments';
import { useContainersData } from '@/hooks/modules/useContainersData';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFreightInvoiceDialog: React.FC<CreateFreightInvoiceDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { shipments } = useFreightShipments();
  const { containers } = useContainersData();

  const form = useForm<Partial<FreightInvoice>>({
    defaultValues: {
      status: 'pending',
      currency: 'EUR'
    }
  });
  
  const onSubmit = async (data: Partial<FreightInvoice>) => {
    try {
      // Si un colis est sélectionné, on récupère ses informations
      if (data.shipmentReference) {
        const shipment = shipments.find(s => s.reference === data.shipmentReference);
        if (shipment) {
          data.clientName = shipment.customerName || shipment.customer;
        }
      }

      // Si un conteneur est sélectionné, on récupère ses coûts
      if (data.containerNumber) {
        const container = containers.find(c => c.number === data.containerNumber);
        if (container && container.costs && container.costs.length > 0) {
          data.containerCost = container.costs.reduce((total, cost) => total + cost.amount, 0);
        }
      }

      const newInvoice = {
        ...data,
        createdAt: new Date().toISOString(),
        status: data.status || 'pending'
      };
      
      await addDocument(COLLECTIONS.FREIGHT.BILLING, newInvoice);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Facture de Transport</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="clientName">Nom du Client</label>
            <input 
              {...form.register('clientName')} 
              className="w-full border rounded p-2" 
              placeholder="Nom du client"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount">Montant</label>
              <input 
                type="number" 
                step="0.01" 
                {...form.register('amount', { setValueAs: (v) => parseFloat(v) })} 
                className="w-full border rounded p-2" 
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label>Devise</label>
              <select {...form.register('currency')} className="w-full border rounded p-2">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label>Référence d'Expédition</label>
            <Select onValueChange={(value) => form.setValue('shipmentReference', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un colis" />
              </SelectTrigger>
              <SelectContent>
                {shipments.map((shipment) => (
                  <SelectItem key={shipment.reference} value={shipment.reference || 'none'}>
                    {shipment.reference} - {shipment.customerName || shipment.customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Conteneur</label>
            <Select onValueChange={(value) => form.setValue('containerNumber', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                {containers.map((container) => (
                  <SelectItem key={container.number} value={container.number || 'none'}>
                    {container.number} - {container.client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label>Statut</label>
            <select {...form.register('status')} className="w-full border rounded p-2">
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              Créer la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFreightInvoiceDialog;
