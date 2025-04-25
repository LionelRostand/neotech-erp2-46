
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Repair } from '../types/garage-types';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface EditRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditRepairDialog = ({ repair, open, onOpenChange, onUpdate }: EditRepairDialogProps) => {
  const { services = [] } = useGarageData();
  const [formData, setFormData] = React.useState<Partial<Repair>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (repair) {
      setFormData(repair);
    }
  }, [repair]);

  if (!repair) return null;

  const handleChange = (field: keyof Repair, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, repair.id);
      await updateDoc(repairRef, {
        ...formData,
        lastUpdated: new Date().toISOString()
      });
      toast.success('Réparation mise à jour avec succès');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la réparation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la réparation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Service</label>
            <Select 
              value={formData.service} 
              onValueChange={(value) => {
                const selectedService = services.find(s => s.name === value);
                if (selectedService) {
                  setFormData(prev => ({
                    ...prev,
                    service: value,
                    estimatedCost: selectedService.cost || prev.estimatedCost
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Statut</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="awaiting_parts">En attente de pièces</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Progression (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.progress || 0}
              onChange={(e) => handleChange('progress', parseInt(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRepairDialog;
