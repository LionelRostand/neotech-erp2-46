
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skill } from '@/types/employee';
import { toast } from 'sonner';

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skill: Skill) => void;
}

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({ open, onOpenChange, onAddSkill }) => {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('débutant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName.trim()) {
      toast.error("Le nom de la compétence est requis");
      return;
    }
    
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName.trim(),
      level: skillLevel
    };
    
    onAddSkill(newSkill);
    toast.success("Compétence ajoutée avec succès");
    
    // Reset form
    setSkillName('');
    setSkillLevel('débutant');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une compétence</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Nom de la compétence</Label>
            <Input 
              id="skill-name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Ex: JavaScript, Management, Design..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skill-level">Niveau</Label>
            <Select 
              value={skillLevel} 
              onValueChange={setSkillLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="débutant">Débutant</SelectItem>
                <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="avancé">Avancé</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog;
