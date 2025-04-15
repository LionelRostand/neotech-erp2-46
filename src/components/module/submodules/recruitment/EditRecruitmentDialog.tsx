
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RecruitmentPost } from '@/types/recruitment';

interface EditRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitment: RecruitmentPost;
  onSuccess?: () => void;
}

const EditRecruitmentDialog: React.FC<EditRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  recruitment,
  onSuccess
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(recruitment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // In a real app, we would update the recruitment in Firestore here
    console.log('Submitting updated recruitment:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Poste mis à jour",
        description: "Les informations du poste ont été mises à jour avec succès."
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le poste</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input 
                id="position" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contractType">Type de contrat</Label>
              <Input 
                id="contractType" 
                name="contractType" 
                value={formData.contractType} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire</Label>
            <Input 
              id="salary" 
              name="salary" 
              value={formData.salary} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Prérequis</Label>
            <Textarea 
              id="requirements" 
              name="requirements" 
              value={Array.isArray(formData.requirements) ? formData.requirements.join('\n') : formData.requirements} 
              onChange={handleChange} 
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecruitmentDialog;
