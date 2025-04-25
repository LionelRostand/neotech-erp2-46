
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';
import { clientsMap, vehiclesMap, mechanicsMap } from './repairsData';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddRepairDialog: React.FC<AddRepairDialogProps> = ({ open, onOpenChange }) => {
  const { clients, vehicles, mechanics, refetch } = useGarageData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    vehicleId: '',
    clientId: '',
    mechanicId: '',
    startDate: new Date().toISOString().split('T')[0],
    estimatedEndDate: '',
    description: '',
    estimatedCost: '',
    status: 'awaiting_approval',
    progress: 0,
  });

  // Fonction pour mettre à jour l'état du formulaire
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Si le client est changé, essayer de trouver ses véhicules
    if (field === 'clientId' && value) {
      const clientVehicles = vehicles.filter(v => v.clientId === value);
      if (clientVehicles.length > 0) {
        setFormData(prev => ({ ...prev, vehicleId: clientVehicles[0].id }));
      }
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Récupérer les noms complets à partir des IDs
      const selectedClient = clients.find(c => c.id === formData.clientId) || 
        { lastName: '', firstName: '' };
      const clientName = `${selectedClient.lastName} ${selectedClient.firstName}`.trim() || 
        clientsMap[formData.clientId as keyof typeof clientsMap] || 'Client inconnu';
      
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId) || { make: '', model: '' };
      const vehicleName = `${selectedVehicle.make} ${selectedVehicle.model}`.trim() || 
        vehiclesMap[formData.vehicleId as keyof typeof vehiclesMap] || 'Véhicule inconnu';
      
      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId) || 
        { lastName: '', firstName: '' };
      const mechanicName = `${selectedMechanic.lastName} ${selectedMechanic.firstName}`.trim() || 
        mechanicsMap[formData.mechanicId as keyof typeof mechanicsMap] || 'Mécanicien inconnu';

      // Préparer les données à enregistrer
      const repairData = {
        ...formData,
        clientName,
        vehicleName,
        mechanicName,
        date: formData.startDate,
        estimatedCost: parseFloat(formData.estimatedCost || '0'),
        progress: parseInt(formData.progress.toString()),
        createdAt: new Date().toISOString()
      };

      // Enregistrer dans Firestore
      await addDocument(COLLECTIONS.GARAGE.REPAIRS, repairData);
      
      // Message de succès et fermeture du dialogue
      toast.success('Réparation ajoutée avec succès');
      onOpenChange(false);
      
      // Réinitialiser le formulaire
      setFormData({
        vehicleId: '',
        clientId: '',
        mechanicId: '',
        startDate: new Date().toISOString().split('T')[0],
        estimatedEndDate: '',
        description: '',
        estimatedCost: '',
        status: 'awaiting_approval',
        progress: 0,
      });

      // Rafraîchir les données
      if (refetch) refetch();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Préparer les options pour les selects
  const clientOptions = clients.length > 0 
    ? clients.map(client => ({
        value: client.id,
        label: `${client.lastName} ${client.firstName}`
      })) 
    : Object.entries(clientsMap).map(([id, name]) => ({
        value: id,
        label: name
      }));

  const vehicleOptions = vehicles.length > 0
    ? vehicles.map(vehicle => ({
        value: vehicle.id,
        label: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate || 'Sans plaque'})`
      }))
    : Object.entries(vehiclesMap).map(([id, name]) => ({
        value: id,
        label: name
      }));

  const mechanicOptions = mechanics.length > 0
    ? mechanics.map(mechanic => ({
        value: mechanic.id,
        label: `${mechanic.lastName} ${mechanic.firstName}`
      }))
    : Object.entries(mechanicsMap).map(([id, name]) => ({
        value: id,
        label: name
      }));

  const statusOptions = [
    { value: 'awaiting_approval', label: 'En attente d\'approbation' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'awaiting_parts', label: 'En attente de pièces' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Véhicule</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => handleChange('vehicleId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mechanicId">Mécanicien</Label>
              <Select
                value={formData.mechanicId}
                onValueChange={(value) => handleChange('mechanicId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {mechanicOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedEndDate">Date de fin estimée</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                value={formData.estimatedEndDate}
                onChange={(e) => handleChange('estimatedEndDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => handleChange('estimatedCost', e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Détails de la réparation..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Ajouter la réparation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
