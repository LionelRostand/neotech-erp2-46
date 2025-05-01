
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeData } from './BadgeTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { updateBadge } from '../employees/services/badgeService';

interface EditBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
  onBadgeUpdated: (badge: BadgeData) => void;
}

const EditBadgeDialog: React.FC<EditBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
  onBadgeUpdated,
}) => {
  const [editedBadge, setEditedBadge] = useState<BadgeData | null>(badge);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setEditedBadge(badge);
  }, [badge]);

  if (!editedBadge) return null;

  const handleChange = (field: keyof BadgeData, value: string) => {
    setEditedBadge(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedBadge) return;

    try {
      setIsSaving(true);
      const statusText = editedBadge.status === 'success' ? 'Actif' : 
                        editedBadge.status === 'error' ? 'Désactivé' : 'Expiré';
      
      const updatedBadge = {...editedBadge, statusText};
      await updateBadge(editedBadge.id, updatedBadge);
      onBadgeUpdated(updatedBadge);
      toast.success('Badge mis à jour avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du badge:', error);
      toast.error('Échec de la mise à jour du badge');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le Badge</DialogTitle>
          <DialogDescription>
            Modifier les informations du badge {editedBadge.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Employé
              </Label>
              <Input
                id="employeeName"
                value={editedBadge.employeeName}
                onChange={(e) => handleChange('employeeName', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Département
              </Label>
              <Input
                id="department"
                value={editedBadge.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <Input
                id="company"
                value={editedBadge.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accessLevel" className="text-right">
                Niveau d'accès
              </Label>
              <Input
                id="accessLevel"
                value={editedBadge.accessLevel}
                onChange={(e) => handleChange('accessLevel', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={editedBadge.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Actif</SelectItem>
                  <SelectItem value="warning">Expiré</SelectItem>
                  <SelectItem value="error">Désactivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBadgeDialog;
