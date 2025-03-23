
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Repair } from './repairsData';

interface UpdateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair;
  onUpdate: (updatedRepair: Repair) => void;
  mechanicsMap: Record<string, string>;
}

const UpdateRepairDialog: React.FC<UpdateRepairDialogProps> = ({
  open,
  onOpenChange,
  repair,
  onUpdate,
  mechanicsMap
}) => {
  const [updatedRepair, setUpdatedRepair] = useState<Repair>({...repair});

  const handleChange = (field: keyof Repair, value: any) => {
    setUpdatedRepair(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedRepair);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mettre à jour la réparation {repair.id}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={updatedRepair.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="awaiting_parts">En attente de pièces</SelectItem>
                  <SelectItem value="awaiting_approval">En attente d'approbation</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mechanicId">Mécanicien</Label>
              <Select
                value={updatedRepair.mechanicId}
                onValueChange={(value) => handleChange('mechanicId', value)}
              >
                <SelectTrigger id="mechanicId">
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mechanicsMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={updatedRepair.progress}
                onChange={(e) => handleChange('progress', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                step="0.01"
                value={updatedRepair.estimatedCost}
                onChange={(e) => handleChange('estimatedCost', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedEndDate">Date de fin estimée</Label>
            <Input
              id="estimatedEndDate"
              type="date"
              value={new Date(updatedRepair.estimatedEndDate).toISOString().split('T')[0]}
              onChange={(e) => handleChange('estimatedEndDate', new Date(e.target.value).toISOString())}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={updatedRepair.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={updatedRepair.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Notes supplémentaires..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Mettre à jour
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRepairDialog;
