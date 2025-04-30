
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container } from '@/types/freight/container-types';
import { Shipment } from '@/types/freight/shipment-types';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFreightInvoiceDialog: React.FC<CreateFreightInvoiceDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('shipment');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    amount: 0,
    shipmentReference: '',
    containerNumber: '',
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    currency: 'EUR',
    containerCost: 0
  });

  // Fetch shipments and containers when dialog opens
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const shipmentsData = await fetchFreightCollectionData<Shipment>('SHIPMENTS');
      const containersData = await fetchFreightCollectionData<Container>('CONTAINERS');
      setShipments(shipmentsData);
      setContainers(containersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedId(value);
    
    if (activeTab === 'shipment') {
      const shipment = shipments.find(s => s.id === value);
      if (shipment) {
        setInvoiceData({
          ...invoiceData,
          clientName: shipment.customer || '',
          amount: shipment.totalPrice || 0,
          shipmentReference: shipment.reference,
          containerNumber: ''
        });
      }
    } else {
      const container = containers.find(c => c.id === value);
      if (container) {
        // Calculate total container costs if available
        const containerCost = container.costs ? 
          container.costs.reduce((sum, cost) => sum + (cost.amount || 0), 0) : 0;
        
        setInvoiceData({
          ...invoiceData,
          clientName: container.client || '',
          amount: containerCost,
          shipmentReference: '',
          containerNumber: container.number,
          containerCost: containerCost
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create new invoice document in Firestore
      await addDoc(collection(db, COLLECTIONS.FREIGHT.BILLING), {
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
      setSelectedId('');
      setInvoiceData({
        clientName: '',
        amount: 0,
        shipmentReference: '',
        containerNumber: '',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'pending',
        currency: 'EUR',
        containerCost: 0
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Erreur lors de la création de la facture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="shipment" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shipment">Depuis une Expédition</TabsTrigger>
            <TabsTrigger value="container">Depuis un Conteneur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipment" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipmentSelect">Sélectionner une expédition</Label>
              <Select onValueChange={handleSelectChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une expédition" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map(shipment => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.reference} - {shipment.customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="container" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="containerSelect">Sélectionner un conteneur</Label>
              <Select onValueChange={handleSelectChange} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un conteneur" />
                </SelectTrigger>
                <SelectContent>
                  {containers.map(container => (
                    <SelectItem key={container.id} value={container.id}>
                      {container.number} - {container.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input 
                id="invoiceNumber" 
                value={invoiceData.invoiceNumber} 
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client</Label>
              <Input 
                id="clientName" 
                value={invoiceData.clientName} 
                onChange={(e) => handleInputChange('clientName', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <div className="flex">
                <Input 
                  type="number" 
                  id="amount" 
                  value={invoiceData.amount} 
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                />
                <Select 
                  value={invoiceData.currency} 
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger className="w-24 ml-2">
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
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={invoiceData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
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
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedId}>
            {isLoading ? 'Création...' : 'Créer la facture'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFreightInvoiceDialog;
