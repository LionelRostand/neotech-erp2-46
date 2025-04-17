
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecruitmentPost } from '@/types/recruitment';
import { toast } from 'sonner';

interface EditRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitment: RecruitmentPost | null;
  onSuccess?: () => void;
}

const EditRecruitmentDialog: React.FC<EditRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  recruitment,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<RecruitmentPost>>(recruitment || {});

  if (!recruitment) return null;

  // Format the salary for display in the form
  const formatSalaryForDisplay = () => {
    if (!formData.salary) return '';
    if (typeof formData.salary === 'string') return formData.salary;
    return `${formData.salary.min}-${formData.salary.max} ${formData.salary.currency}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Annonce de recrutement mise à jour avec succès");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'annonce de recrutement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouverte">Ouverte</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Entretiens">Entretiens</SelectItem>
                  <SelectItem value="Offre">Offre</SelectItem>
                  <SelectItem value="Fermée">Fermée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => handleSelectChange('contractType', value)}
              >
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Temps plein</SelectItem>
                  <SelectItem value="part-time">Temps partiel</SelectItem>
                  <SelectItem value="temporary">Temporaire</SelectItem>
                  <SelectItem value="internship">Stage</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salaire</Label>
              <Input
                id="salary"
                name="salary"
                value={formatSalaryForDisplay()}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManagerName">Responsable recrutement</Label>
              <Input
                id="hiringManagerName"
                name="hiringManagerName"
                value={formData.hiringManagerName || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Prérequis et compétences</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={typeof formData.requirements === 'string' ? formData.requirements : formData.requirements?.join('\n')}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecruitmentDialog;
