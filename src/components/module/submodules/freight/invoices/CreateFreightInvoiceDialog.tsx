
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getDocs } from 'firebase/firestore';
import { useFreightShipments } from '@/hooks/freight/useFreightShipments';
import { Shipment } from '@/hooks/freight/useFreightShipments';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Container {
  id: string;
  number: string;
  client: string;
  costs?: Array<{ amount: number }>;
}

export const CreateFreightInvoiceDialog = ({ open, onOpenChange }: CreateFreightInvoiceDialogProps) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      clientName: '',
      amount: '',
      invoiceNumber: '',
      containerNumber: '',
      shipmentReference: ''
    }
  });
  
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const { shipments } = useFreightShipments();
  
  // Fetch containers from the database
  const { data: containers = [] } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CONTAINERS));
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Container[];
    }
  });

  // Update client and amount when shipment or container selection changes
  useEffect(() => {
    if (selectedShipment) {
      const shipment = shipments.find(s => s.reference === selectedShipment);
      if (shipment) {
        setValue('clientName', shipment.customerName || '');
        setValue('amount', shipment.totalPrice?.toString() || '0');
        setValue('shipmentReference', shipment.reference);
        setValue('containerNumber', '');
        setSelectedContainer('');
      }
    } else if (selectedContainer) {
      const container = containers.find(c => c.number === selectedContainer);
      if (container) {
        setValue('clientName', container.client || '');
        const containerCost = container.costs?.[0]?.amount || 0;
        setValue('amount', containerCost.toString());
        setValue('containerNumber', container.number);
        setValue('shipmentReference', '');
        setSelectedShipment('');
      }
    }
  }, [selectedShipment, selectedContainer, shipments, containers, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const invoiceData = {
        clientName: data.clientName,
        amount: parseFloat(data.amount),
        invoiceNumber: data.invoiceNumber || `FACT-${Date.now().toString().slice(-6)}`,
        containerNumber: data.containerNumber || null,
        shipmentReference: data.shipmentReference || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: 'EUR'
      };

      const invoicesCollection = collection(db, COLLECTIONS.FREIGHT.BILLING);
      const docRef = await addDoc(invoicesCollection, invoiceData);
      
      toast.success('Facture créée avec succès');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="shipmentReference">Référence colis</Label>
            <Select 
              value={selectedShipment} 
              onValueChange={(value) => {
                setSelectedShipment(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un colis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {shipments.map((shipment) => (
                  <SelectItem key={shipment.id} value={shipment.reference}>
                    {shipment.reference} - {shipment.customerName || 'Client inconnu'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="containerNumber">Référence conteneur</Label>
            <Select 
              value={selectedContainer} 
              onValueChange={(value) => {
                setSelectedContainer(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un conteneur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {containers.map((container) => (
                  <SelectItem key={container.id} value={container.number}>
                    {container.number} - {container.client || 'Client inconnu'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client *</Label>
              <Input 
                id="clientName" 
                {...register('clientName', { required: 'Le client est requis' })} 
                placeholder="Nom du client"
              />
              {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant * (€)</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01" 
                {...register('amount', { required: 'Le montant est requis' })} 
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Numéro de facture</Label>
            <Input 
              id="invoiceNumber" 
              {...register('invoiceNumber')} 
              placeholder="FRE-001"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Annuler
            </Button>
            <Button type="submit">Créer la facture</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
