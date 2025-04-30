
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const { updateEmployee } = useEmployeeActions();
  
  // S'assurer que les compétences sont toujours un tableau
  const skills = Array.isArray(employee.skills) ? employee.skills : [];
  
  // Niveaux de compétence
  const skillLevels = [
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
    { value: 'expert', label: 'Expert' }
  ];
  
  // Fonction pour déterminer la couleur du badge en fonction du niveau
  const getSkillBadgeColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'intermediate':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'expert':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Fonction pour ajouter une nouvelle compétence
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Le nom de la compétence est requis");
      return;
    }
    
    try {
      // Créer la nouvelle compétence
      const newSkillObj: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: skillLevel
      };
      
      // Mettre à jour l'employé avec la nouvelle compétence
      await updateEmployee({
        id: employee.id,
        skills: [...skills, newSkillObj]
      });
      
      // Réinitialiser le formulaire
      setNewSkill('');
      setSkillLevel('intermediate');
      setIsAddingSkill(false);
      
      toast.success("Compétence ajoutée avec succès");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Erreur lors de l'ajout de la compétence");
    }
  };
  
  // Fonction pour supprimer une compétence
  const handleDeleteSkill = async (skillId: string) => {
    try {
      // Filtrer les compétences pour retirer celle qu'on supprime
      const updatedSkills = skills.filter((skill: any) => {
        if (typeof skill === 'string') return skill !== skillId;
        return skill.id !== skillId;
      });
      
      // Mettre à jour l'employé avec les compétences mises à jour
      await updateEmployee({
        id: employee.id,
        skills: updatedSkills
      });
      
      toast.success("Compétence supprimée avec succès");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Erreur lors de la suppression de la compétence");
    }
  };
  
  // Fonction pour rendre une compétence (gestion des différents formats possibles)
  const renderSkill = (skill: Skill | string, index: number) => {
    // Si la compétence est une chaîne de caractères
    if (typeof skill === 'string') {
      return (
        <Badge 
          key={index} 
          className="text-sm mr-2 mb-2"
          onClick={() => handleDeleteSkill(skill)}
        >
          {skill}
        </Badge>
      );
    }
    
    // Si la compétence est un objet
    return (
      <Badge 
        key={skill.id} 
        className={`text-sm mr-2 mb-2 cursor-pointer ${getSkillBadgeColor(skill.level)}`}
        onClick={() => handleDeleteSkill(skill.id)}
      >
        {skill.name} 
        <span className="ml-1 text-xs opacity-70">
          ({skillLevels.find(l => l.value === skill.level)?.label || skill.level})
        </span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Compétences</h3>
        <Button size="sm" onClick={() => setIsAddingSkill(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une compétence
        </Button>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        {skills.length > 0 ? (
          <div className="flex flex-wrap">
            {skills.map((skill, index) => renderSkill(skill, index))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Aucune compétence n'a été ajoutée pour cet employé
          </p>
        )}
      </div>
      
      {/* Dialog pour ajouter une compétence */}
      <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une compétence</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skill">Nom de la compétence</Label>
              <Input
                id="skill"
                placeholder="Ex: React, Négociation, Management..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Select 
                value={skillLevel}
                onValueChange={setSkillLevel}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAddingSkill(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddSkill}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetencesTab;
