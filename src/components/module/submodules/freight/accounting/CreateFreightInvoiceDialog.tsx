
import React, { useState, useEffect } from 'react';
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
  const { containers, shipments, clients } = useFreightData();
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedShipment, setSelectedShipment] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [total, setTotal] = useState<number>(0);
  const [clientName, setClientName] = useState('');
  
  // Effet pour récupérer les informations en fonction des sélections
  useEffect(() => {
    // Réinitialiser le total
    let newTotal = 0;
    let newClientName = '';

    // Récupérer les informations du conteneur sélectionné
    if (selectedContainer) {
      const container = containers?.find(c => c.number === selectedContainer);
      if (container) {
        // Récupérer le coût du conteneur
        if (container.costs && container.costs.length > 0) {
          newTotal += Number(container.costs[0].amount) || 0;
        }
        
        // Récupérer le client du conteneur
        if (container.client) {
          newClientName = container.client;
        }
      }
    }

    // Récupérer les informations de l'expédition sélectionnée
    if (selectedShipment) {
      const shipment = shipments?.find(s => s.reference === selectedShipment);
      if (shipment) {
        // Ajouter le prix total de l'expédition si disponible
        if (shipment.totalPrice) {
          newTotal += Number(shipment.totalPrice) || 0;
        }
        
        // Récupérer le client de l'expédition si pas déjà défini
        if (!newClientName && shipment.customer) {
          newClientName = shipment.customer;
        }
      }
    }
    
    // Récupérer le nom du client sélectionné
    if (selectedClient) {
      const client = clients?.find(c => c.id === selectedClient);
      if (client && client.name) {
        newClientName = client.name;
      }
    }

    // Mettre à jour l'état
    setTotal(newTotal);
    setClientName(newClientName);
  }, [selectedContainer, selectedShipment, selectedClient, containers, shipments, clients]);

  const handleSubmit = () => {
    if (!selectedContainer && !selectedShipment && !selectedClient) {
      toast.error("Veuillez sélectionner au moins un conteneur, une expédition ou un client");
      return;
    }

    if (!clientName) {
      toast.error("Impossible de déterminer le client. Veuillez sélectionner un client.");
      return;
    }

    const invoiceData = {
      containerReference: selectedContainer,
      shipmentReference: selectedShipment,
      clientId: selectedClient,
      clientName: clientName,
      total: total,
      date: new Date().toISOString(),
      status: 'pending',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
      currency: 'EUR'
    };

    onSubmit(invoiceData);
    resetForm();
  };

  const resetForm = () => {
    setSelectedContainer('');
    setSelectedShipment('');
    setSelectedClient('');
    setTotal(0);
    setClientName('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
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
                <SelectItem value="">Aucun</SelectItem>
                {containers?.map(container => (
                  <SelectItem key={container.number} value={container.number}>
                    {container.number} - {container.client} {container.costs && container.costs.length > 0 ? `(${container.costs[0].amount} €)` : ''}
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
                <SelectItem value="">Aucune</SelectItem>
                {shipments?.map(shipment => (
                  <SelectItem key={shipment.reference} value={shipment.reference}>
                    {shipment.reference} - {shipment.customer} {shipment.totalPrice ? `(${shipment.totalPrice} €)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Select 
              value={selectedClient} 
              onValueChange={setSelectedClient}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {clients?.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clientName">Nom du client</Label>
            <Input 
              id="clientName" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
              disabled={!!selectedContainer || !!selectedShipment || !!selectedClient}
            />
          </div>

          <div>
            <Label htmlFor="total">Montant total (€)</Label>
            <Input 
              id="total" 
              type="number" 
              value={total} 
              onChange={(e) => setTotal(Number(e.target.value))}
            />
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
