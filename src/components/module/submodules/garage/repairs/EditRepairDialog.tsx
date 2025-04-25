
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Repair } from '../../types/garage-types';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { toast } from 'sonner';
import { clientsMap, vehiclesMap, mechanicsMap } from './repairsData';

interface EditRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditRepairDialog: React.FC<EditRepairDialogProps> = ({ 
  repair, 
  open, 
  onOpenChange,
  onUpdate 
}) => {
  const { clients, vehicles, mechanics } = useGarageData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Repair>>({});

  // Reset form data when dialog opens or repair changes
  React.useEffect(() => {
    if (repair) {
      setFormData({
        ...repair
      });
    }
  }, [repair, open]);

  if (!repair) return null;

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // If client changes, try to find their vehicles
    if (field === 'clientId' && value) {
      const clientVehicles = vehicles.filter(v => v.clientId === value);
      if (clientVehicles.length > 0) {
        setFormData(prev => ({ ...prev, vehicleId: clientVehicles[0].id }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repair || !repair.id) return;
    
    setIsSubmitting(true);

    try {
      // Get full names from IDs
      const selectedClient = clients.find(c => c.id === formData.clientId) || 
        { lastName: '', firstName: '' };
      const clientName = `${selectedClient.lastName} ${selectedClient.firstName}`.trim() || 
        clientsMap[formData.clientId as keyof typeof clientsMap] || repair.clientName || 'Client inconnu';
      
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId) || { make: '', model: '' };
      const vehicleName = `${selectedVehicle.make} ${selectedVehicle.model}`.trim() || 
        vehiclesMap[formData.vehicleId as keyof typeof vehiclesMap] || repair.vehicleName || 'Véhicule inconnu';
      
      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId) || 
        { lastName: '', firstName: '' };
      const mechanicName = `${selectedMechanic.lastName} ${selectedMechanic.firstName}`.trim() || 
        mechanicsMap[formData.mechanicId as keyof typeof mechanicsMap] || repair.mechanicName || 'Mécanicien inconnu';

      // Prepare data to save
      const updatedData = {
        ...formData,
        clientName,
        vehicleName,
        mechanicName,
        estimatedCost: typeof formData.estimatedCost === 'string' 
          ? parseFloat(formData.estimatedCost) 
          : formData.estimatedCost,
        actualCost: typeof formData.actualCost === 'string' 
          ? parseFloat(formData.actualCost || '0') 
          : formData.actualCost,
        progress: typeof formData.progress === 'string' 
          ? parseInt(formData.progress) 
          : formData.progress,
        updatedAt: new Date().toISOString()
      };

      // If completed, set end date
      if (formData.status === 'completed' && !formData.endDate) {
        updatedData.endDate = new Date().toISOString().split('T')[0];
      }

      await updateDocument(COLLECTIONS.GARAGE.REPAIRS, repair.id, updatedData);
      
      toast.success('Réparation mise à jour avec succès');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réparation:', error);
      toast.error('Erreur lors de la mise à jour de la réparation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare options for selects
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
          <DialogTitle>Modifier la réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={formData.clientId || ''}
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
                value={formData.vehicleId || ''}
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
                value={formData.mechanicId || ''}
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
                value={formData.status || ''}
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
                value={(formData.startDate || formData.date || '').split('T')[0]}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedEndDate">Date de fin estimée</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                value={(formData.estimatedEndDate || '').split('T')[0]}
                onChange={(e) => handleChange('estimatedEndDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost || ''}
                onChange={(e) => handleChange('estimatedCost', e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualCost">Coût réel (€)</Label>
              <Input
                id="actualCost"
                type="number"
                value={formData.actualCost || ''}
                onChange={(e) => handleChange('actualCost', e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                value={formData.progress || 0}
                onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            {formData.status === 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin réelle</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={(formData.endDate || '').split('T')[0]}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
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
              {isSubmitting ? 'Enregistrement...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRepairDialog;
