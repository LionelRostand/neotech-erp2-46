
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeData } from './BadgeTypes';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
  const [formData, setFormData] = useState<Partial<BadgeData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idError, setIdError] = useState<string>('');

  useEffect(() => {
    if (badge) {
      setFormData({
        id: badge.id,
        employeeName: badge.employeeName,
        employeeId: badge.employeeId,
        department: badge.department,
        company: badge.company,
        accessLevel: badge.accessLevel,
        status: badge.status,
        date: badge.date,
      });
      setIdError('');
    }
  }, [badge]);

  if (!badge) return null;

  const handleInputChange = (field: keyof BadgeData, value: string) => {
    // Vérification spécifique pour l'ID du badge
    if (field === 'id') {
      if (value.length > 6) {
        setIdError('Le numéro de badge ne doit pas dépasser 6 caractères');
      } else {
        setIdError('');
      }
      // On limite le texte saisi à 6 caractères
      value = value.substring(0, 6);
    }

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de la longueur de l'ID
    if (formData.id && formData.id.length > 6) {
      setIdError('Le numéro de badge ne doit pas dépasser 6 caractères');
      return;
    }

    if (!formData.id || !formData.employeeName) {
      toast.error("Le numéro de badge et le nom de l'employé sont requis");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Mise à jour du badge dans la base de données
      await updateBadge(badge.id, formData as BadgeData);

      // Notifier le composant parent de la mise à jour
      onBadgeUpdated(formData as BadgeData);
      
      toast.success("Badge mis à jour avec succès");
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du badge:", error);
      toast.error("Échec de la mise à jour du badge");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le badge</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge-id" className="text-right">
                N° Badge
              </Label>
              <div className="col-span-3">
                <Input
                  id="badge-id"
                  value={formData.id || ''}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  maxLength={6}
                  className={idError ? 'border-red-500' : ''}
                />
                {idError && <p className="text-xs text-red-500 mt-1">{idError}</p>}
                <p className="text-xs text-muted-foreground mt-1">Maximum 6 caractères</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee-name" className="text-right">
                Employé
              </Label>
              <Input
                id="employee-name"
                value={formData.employeeName || ''}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Département
              </Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="access-level" className="text-right">
                Niveau d'accès
              </Label>
              <Input
                id="access-level"
                value={formData.accessLevel || ''}
                onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Actif</SelectItem>
                    <SelectItem value="error">Désactivé</SelectItem>
                    <SelectItem value="warning">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBadgeDialog;
