
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface Option {
  label: string;
  value: string;
  origin?: string;
  destination?: string;
}

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: any | null;
  carrierOptions: Option[];
  clientOptions: Option[];
  routeOptions: Option[];
}

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions,
}) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'dry',
    size: '20ft',
    status: 'in_transit',
    carrierName: '',
    carrierId: '',
    client: '',
    clientId: '',
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes or container changes
  useEffect(() => {
    if (open && container) {
      setFormData({
        number: container.number || '',
        type: container.type || 'dry',
        size: container.size || '20ft',
        status: container.status || 'in_transit',
        carrierName: container.carrierName || '',
        carrierId: container.carrierId || '',
        client: container.client || '',
        clientId: container.clientId || '',
        origin: container.origin || '',
        destination: container.destination || '',
        departureDate: container.departureDate || '',
        arrivalDate: container.arrivalDate || '',
      });
    } else if (open) {
      // Clear form for new container
      setFormData({
        number: '',
        type: 'dry',
        size: '20ft',
        status: 'in_transit',
        carrierName: '',
        carrierId: '',
        client: '',
        clientId: '',
        origin: '',
        destination: '',
        departureDate: '',
        arrivalDate: '',
      });
    }
  }, [open, container]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const carrierId = e.target.value;
    const carrier = carrierOptions.find(c => c.value === carrierId);
    if (carrier) {
      setFormData(prev => ({
        ...prev,
        carrierId,
        carrierName: carrier.label
      }));
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = clientOptions.find(c => c.value === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId,
        client: client.label
      }));
    }
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const routeId = e.target.value;
    const route = routeOptions.find(r => r.value === routeId);
    if (route) {
      setFormData(prev => ({
        ...prev,
        routeId,
        origin: route.origin || '',
        destination: route.destination || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (container) {
        // Update existing container
        await updateDoc(doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast.success('Conteneur mis à jour avec succès');
      } else {
        // Create new container
        await addDoc(collection(db, COLLECTIONS.FREIGHT.CONTAINERS), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success('Conteneur créé avec succès');
      }
      onClose();
    } catch (error) {
      console.error('Error saving container:', error);
      toast.error('Erreur lors de l\'enregistrement du conteneur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{container ? 'Modifier le conteneur' : 'Nouveau conteneur'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro de conteneur</label>
              <Input 
                name="number" 
                value={formData.number} 
                onChange={handleInputChange} 
                required 
                placeholder="ex: MSCU1234567"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="dry">Standard (Dry)</option>
                <option value="reefer">Réfrigéré (Reefer)</option>
                <option value="open_top">Toit ouvert (Open Top)</option>
                <option value="flat_rack">Plateau (Flat Rack)</option>
                <option value="tank">Citerne (Tank)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Taille</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="20ft">20 pieds</option>
                <option value="40ft">40 pieds</option>
                <option value="40ft_hc">40 pieds HC</option>
                <option value="45ft">45 pieds</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="in_transit">En transit</option>
                <option value="loading">En chargement</option>
                <option value="delivered">Livré</option>
                <option value="customs">En douane</option>
                <option value="ready">Prêt</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transporteur</label>
              <select
                value={formData.carrierId}
                onChange={handleCarrierChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner un transporteur</option>
                {carrierOptions.map((carrier) => (
                  <option key={carrier.value} value={carrier.value}>
                    {carrier.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <select
                value={formData.clientId}
                onChange={handleClientChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner un client</option>
                {clientOptions.map((client) => (
                  <option key={client.value} value={client.value}>
                    {client.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Route</label>
              <select
                onChange={handleRouteChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner une route</option>
                {routeOptions.map((route) => (
                  <option key={route.value} value={route.value}>
                    {route.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origine</label>
              <Input 
                name="origin" 
                value={formData.origin} 
                onChange={handleInputChange} 
                placeholder="ex: Shanghai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input 
                name="destination" 
                value={formData.destination} 
                onChange={handleInputChange} 
                placeholder="ex: Le Havre"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de départ</label>
              <Input 
                type="date" 
                name="departureDate" 
                value={formData.departureDate} 
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date d'arrivée prévue</label>
              <Input 
                type="date" 
                name="arrivalDate" 
                value={formData.arrivalDate} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : container ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
