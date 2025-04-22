
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

interface EditFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onSubmit: (data: any) => void;
}

export const EditFreightInvoiceDialog = ({ 
  open, 
  onOpenChange,
  invoice,
  onSubmit 
}: EditFreightInvoiceDialogProps) => {
  const { containers, shipments, clients } = useFreightData();
  const [formData, setFormData] = useState({
    containerReference: '',
    shipmentReference: '',
    clientName: '',
    total: 0,
    status: 'pending',
    issueDate: '',
    dueDate: ''
  });

  // Initialiser le formulaire avec les données de la facture
  useEffect(() => {
    if (invoice) {
      setFormData({
        containerReference: invoice.containerReference || '',
        shipmentReference: invoice.shipmentReference || '',
        clientName: invoice.clientName || '',
        total: invoice.total || 0,
        status: invoice.status || 'pending',
        issueDate: invoice.issueDate || invoice.date || new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [invoice]);

  // Effet pour récupérer les informations en fonction des sélections
  useEffect(() => {
    if (!formData.containerReference && !formData.shipmentReference) return;

    let newTotal = formData.total;
    
    // Récupérer les informations du conteneur sélectionné
    if (formData.containerReference && formData.containerReference !== invoice.containerReference) {
      const container = containers?.find(c => c.number === formData.containerReference);
      if (container && container.costs && container.costs.length > 0) {
        newTotal = Number(container.costs[0].amount) || 0;
      }
    }

    // Récupérer les informations de l'expédition sélectionnée
    if (formData.shipmentReference && formData.shipmentReference !== invoice.shipmentReference) {
      const shipment = shipments?.find(s => s.reference === formData.shipmentReference);
      if (shipment && shipment.totalPrice) {
        newTotal = Number(shipment.totalPrice) || 0;
      }
    }

    // Mettre à jour le montant total si différent
    if (newTotal !== formData.total) {
      setFormData(prev => ({ ...prev, total: newTotal }));
    }
  }, [formData.containerReference, formData.shipmentReference, containers, shipments, invoice]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="container">Conteneur</Label>
            <Select 
              value={formData.containerReference} 
              onValueChange={(value) => handleChange('containerReference', value)}
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
              value={formData.shipmentReference} 
              onValueChange={(value) => handleChange('shipmentReference', value)}
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
            <Label htmlFor="clientName">Nom du client</Label>
            <Input 
              id="clientName" 
              value={formData.clientName} 
              onChange={(e) => handleChange('clientName', e.target.value)} 
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total">Montant total (€)</Label>
            <Input 
              id="total" 
              type="number" 
              value={formData.total} 
              onChange={(e) => handleChange('total', Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="issueDate">Date d'émission</Label>
            <Input 
              id="issueDate" 
              type="date" 
              value={formatDateForInput(formData.issueDate)} 
              onChange={(e) => handleChange('issueDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={formatDateForInput(formData.dueDate)} 
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
