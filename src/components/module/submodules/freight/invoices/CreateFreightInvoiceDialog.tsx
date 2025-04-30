
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { Shipment } from '@/types/freight/shipment-types';
import { Container } from '@/types/freight/container-types';
import { toast } from 'sonner';
import { generateDocuments } from '../utils/documentGenerator';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFreightInvoiceDialog: React.FC<CreateFreightInvoiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  // States
  const [invoiceType, setInvoiceType] = useState<'shipment' | 'container'>('shipment');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [formData, setFormData] = useState({
    clientName: '',
    amount: 0,
    containerCost: 0,
    status: 'pending',
    shipmentReference: '',
    containerNumber: '',
    invoiceNumber: `INV-${Date.now().toString().substring(8, 13)}`,
    currency: 'EUR',
    paymentMethod: 'bank_transfer',
    paymentReference: '',
  });

  // Fetch containers data
  const { data: containers = [], isLoading: containersLoading } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: () => fetchFreightCollectionData<Container>('CONTAINERS')
  });

  // Fetch shipments data
  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery({
    queryKey: ['freight', 'shipments'],
    queryFn: () => fetchFreightCollectionData<Shipment>('SHIPMENTS')
  });

  // Handle selection change
  const handleItemSelection = (id: string) => {
    setSelectedItemId(id);

    if (invoiceType === 'shipment') {
      const shipment = shipments.find(s => s.id === id);
      if (shipment) {
        setFormData({
          ...formData,
          clientName: shipment.customer || '',
          amount: shipment.totalPrice || calculateShipmentTotal(shipment),
          shipmentReference: shipment.reference || '',
          containerNumber: '',
        });
      }
    } else {
      const container = containers.find(c => c.id === id);
      if (container) {
        setFormData({
          ...formData,
          clientName: container.client || '',
          containerCost: calculateContainerTotal(container),
          amount: calculateContainerTotal(container),
          containerNumber: container.number || '',
          shipmentReference: '',
        });
      }
    }
  };

  // Calculate shipment total
  const calculateShipmentTotal = (shipment: Shipment): number => {
    return shipment.lines.reduce((total, line) => total + (line.cost || 0), 0);
  };

  // Calculate container total
  const calculateContainerTotal = (container: Container): number => {
    if (container.costs && Array.isArray(container.costs)) {
      return container.costs.reduce((total, cost) => total + (cost.amount || 0), 0);
    }
    return 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'containerCost' ? parseFloat(value) : value,
    });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare invoice data
      const invoiceData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      const collectionPath = COLLECTIONS.FREIGHT.BILLING;
      console.log('Saving invoice to collection:', collectionPath);
      const docRef = await addDoc(collection(db, collectionPath), invoiceData);
      
      // Generate documents
      await generateDocuments(
        { 
          id: docRef.id, 
          ...invoiceData 
        }, 
        { 
          paymentMethod: formData.paymentMethod, 
          paymentReference: formData.paymentReference 
        }
      );

      toast.success('Facture créée avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
          <DialogDescription>
            Créer une facture à partir d'une expédition ou d'un conteneur
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={invoiceType} onValueChange={(value) => setInvoiceType(value as 'shipment' | 'container')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shipment">Expédition</TabsTrigger>
            <TabsTrigger value="container">Conteneur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipment" className="space-y-4">
            <div>
              <Label htmlFor="shipmentSelect">Sélectionner une expédition</Label>
              <Select value={selectedItemId} onValueChange={handleItemSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une expédition" />
                </SelectTrigger>
                <SelectContent>
                  {shipmentsLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : shipments.length === 0 ? (
                    <SelectItem value="none" disabled>Aucune expédition disponible</SelectItem>
                  ) : (
                    shipments.map((shipment) => (
                      <SelectItem key={shipment.id} value={shipment.id}>
                        {shipment.reference} - {shipment.customer || 'Client non spécifié'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="container" className="space-y-4">
            <div>
              <Label htmlFor="containerSelect">Sélectionner un conteneur</Label>
              <Select value={selectedItemId} onValueChange={handleItemSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un conteneur" />
                </SelectTrigger>
                <SelectContent>
                  {containersLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : containers.length === 0 ? (
                    <SelectItem value="none" disabled>Aucun conteneur disponible</SelectItem>
                  ) : (
                    containers.map((container) => (
                      <SelectItem key={container.id} value={container.id}>
                        {container.number} - {container.client || 'Client non spécifié'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant total</Label>
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
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Méthode de paiement</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="credit_card">Carte de crédit</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="paymentReference">Référence de paiement</Label>
            <Input
              id="paymentReference"
              name="paymentReference"
              value={formData.paymentReference}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
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

export default CreateFreightInvoiceDialog;
