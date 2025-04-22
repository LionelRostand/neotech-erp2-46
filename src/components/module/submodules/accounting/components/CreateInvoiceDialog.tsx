
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Container, Shipment } from '@/types/freight';
import { Invoice } from '../types/accounting-types';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Invoice>) => void;
}

interface InvoiceFormData {
  shipmentId: string;
  containerId: string;
  clientName: string;
  paymentMethod: string;
  notes: string;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    shipmentId: '',
    containerId: '',
    clientName: '',
    paymentMethod: 'bank_transfer',
    notes: '',
  });
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch shipments
  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery({
    queryKey: ['freight', 'shipments'],
    queryFn: () => fetchCollectionData<Shipment>(COLLECTIONS.FREIGHT.SHIPMENTS),
  });

  // Fetch containers
  const { data: containers = [], isLoading: containersLoading } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: () => fetchCollectionData<Container>(COLLECTIONS.FREIGHT.CONTAINERS),
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        shipmentId: '',
        containerId: '',
        clientName: '',
        paymentMethod: 'bank_transfer',
        notes: '',
      });
      setSelectedShipment(null);
      setSelectedContainer(null);
    }
  }, [open]);

  // Update selected shipment when shipmentId changes
  useEffect(() => {
    if (formData.shipmentId) {
      const shipment = shipments.find(s => s.id === formData.shipmentId) || null;
      setSelectedShipment(shipment);
      
      if (shipment) {
        // Update client name from shipment
        setFormData(prev => ({
          ...prev,
          clientName: shipment.customer || ''
        }));
        
        // Try to find related container by reference
        const container = containers.find(c => c.number === shipment.reference) || null;
        if (container) {
          setSelectedContainer(container);
          setFormData(prev => ({
            ...prev,
            containerId: container.id
          }));
        }
      }
    } else {
      setSelectedShipment(null);
      setSelectedContainer(null);
    }
  }, [formData.shipmentId, shipments, containers]);

  // When container is selected, update container-related data
  useEffect(() => {
    if (formData.containerId && !selectedContainer) {
      const container = containers.find(c => c.id === formData.containerId) || null;
      setSelectedContainer(container);
    }
  }, [formData.containerId, containers, selectedContainer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get costs from container if available
      const containerCost = selectedContainer?.costs?.[0]?.amount || 0;
      
      const invoiceData: Partial<Invoice> = {
        clientName: formData.clientName,
        clientId: selectedShipment?.customer || '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        currency: 'EUR',
        items: [
          {
            description: selectedShipment 
              ? `Transport ${selectedShipment.origin} vers ${selectedShipment.destination}` 
              : 'Services de transport',
            quantity: 1,
            unitPrice: containerCost,
            total: containerCost,
          }
        ],
        subtotal: containerCost,
        tax: containerCost * 0.2,
        taxRate: 20,
        taxAmount: containerCost * 0.2,
        total: containerCost * 1.2,
        shipmentReference: selectedShipment?.reference || '',
        containerReference: selectedContainer?.number || '',
        containerCost: containerCost,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
      };
      
      onSubmit(invoiceData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  // Safe value function to ensure no empty string values
  const safeValue = (value: string | undefined): string => {
    return value || 'non-specifie';
  };
  
  // Safe label function to create descriptive labels
  const getShipmentLabel = (shipment: Shipment): string => {
    return `${shipment.reference || 'Réf. Non spécifiée'} - ${shipment.origin || '?'} à ${shipment.destination || '?'} (${shipment.customer || 'Client inconnu'})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Shipment Selection */}
            <div>
              <Label htmlFor="shipmentId">Expédition</Label>
              <Select 
                value={formData.shipmentId} 
                onValueChange={(value) => handleSelectChange('shipmentId', value)}
                disabled={shipmentsLoading || isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une expédition" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.length === 0 && (
                    <SelectItem value="no-shipments">Aucune expédition disponible</SelectItem>
                  )}
                  {shipments.map((shipment) => (
                    <SelectItem 
                      key={shipment.id} 
                      value={safeValue(shipment.id)}
                    >
                      {getShipmentLabel(shipment)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Container Info */}
            {selectedShipment && (
              <div>
                <Label>Numéro de Conteneur</Label>
                <Select 
                  value={formData.containerId} 
                  onValueChange={(value) => handleSelectChange('containerId', value)}
                  disabled={containersLoading || isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un conteneur" />
                  </SelectTrigger>
                  <SelectContent>
                    {containers
                      .filter(c => c.number === selectedShipment.reference)
                      .map((container) => (
                        <SelectItem 
                          key={container.id} 
                          value={safeValue(container.id)}
                        >
                          {container.number || 'Numéro non spécifié'} - {container.origin} à {container.destination}
                        </SelectItem>
                      ))}
                    {containers.filter(c => c.number === selectedShipment.reference).length === 0 && (
                      <SelectItem value="no-container">Aucun conteneur trouvé pour cette expédition</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Client Name */}
            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                readOnly={!!selectedShipment}
              />
            </div>
            
            {/* Payment Method */}
            <div>
              <Label htmlFor="paymentMethod">Méthode de Paiement</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Virement Bancaire</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                  <SelectItem value="card">Carte Bancaire</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes}
                onChange={handleInputChange}
                rows={3} 
              />
            </div>
            
            {/* Display selected data */}
            {selectedContainer && (
              <div className="border-t pt-4 mt-4">
                <div className="text-sm">
                  <p><strong>Expédition:</strong> {selectedShipment?.reference || 'N/A'}</p>
                  <p><strong>Conteneur:</strong> {selectedContainer.number || 'N/A'}</p>
                  <p><strong>Client:</strong> {formData.clientName || selectedContainer.client || 'N/A'}</p>
                  <p><strong>Coût:</strong> {(selectedContainer.costs?.[0]?.amount || 0).toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.shipmentId || isLoading}
            >
              {isLoading ? 'Création...' : 'Créer la facture'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
