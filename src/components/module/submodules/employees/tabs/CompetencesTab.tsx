
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Plus, X, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';

interface CompetencesTabProps {
  employee: Employee;
}

const skillLevels = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' }
];

export const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const [skills, setSkills] = useState<(Skill | string)[]>(employee.skills || []);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' });
  const { updateEmployee, isLoading } = useEmployeeActions();
  
  // Trie les compétences par niveau
  const sortedSkills = [...skills].sort((a, b) => {
    const levelA = typeof a === 'object' ? a.level : 'intermediate';
    const levelB = typeof b === 'object' ? b.level : 'intermediate';
    
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    return levels.indexOf(levelB) - levels.indexOf(levelA);
  });
  
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error("Le nom de la compétence est requis");
      return;
    }
    
    const skillToAdd: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkill.name,
      level: newSkill.level
    };
    
    const updatedSkills = [...skills, skillToAdd];
    setSkills(updatedSkills);
    
    // Mettre à jour dans la base de données
    updateEmployee({
      id: employee.id,
      skills: updatedSkills
    }).then(() => {
      toast.success("Compétence ajoutée avec succès");
      setNewSkill({ name: '', level: 'intermediate' });
    }).catch(error => {
      console.error("Erreur lors de l'ajout de la compétence:", error);
      toast.error("Erreur lors de l'ajout de la compétence");
    });
  };
  
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter(skill => 
      typeof skill === 'object' ? skill.id !== skillId : skill !== skillId
    );
    
    setSkills(updatedSkills);
    
    // Mettre à jour dans la base de données
    updateEmployee({
      id: employee.id,
      skills: updatedSkills
    }).then(() => {
      toast.success("Compétence supprimée avec succès");
    }).catch(error => {
      console.error("Erreur lors de la suppression de la compétence:", error);
      toast.error("Erreur lors de la suppression de la compétence");
    });
  };
  
  const getLevelLabel = (level: string) => {
    const skillLevel = skillLevels.find(sl => sl.value === level);
    return skillLevel ? skillLevel.label : level;
  };
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'intermediate':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'expert':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout de compétence */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium mb-3">Ajouter une compétence</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-600 mb-1 block">Nom de la compétence</label>
            <Input
              type="text"
              placeholder="Ex: Excel, Management, ..."
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="w-[200px]">
            <label className="text-sm text-gray-600 mb-1 block">Niveau</label>
            <Select 
              value={newSkill.level} 
              onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: value }))}
            >
              <SelectTrigger>
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
          <div className="self-end">
            <Button onClick={handleAddSkill} disabled={isLoading || !newSkill.name.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>
      
      {/* Liste des compétences */}
      <div>
        <h3 className="font-medium mb-3">Compétences ({skills.length})</h3>
        
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            <p>Aucune compétence enregistrée pour cet employé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedSkills.map((skill, index) => {
              // Handle both object and string skill formats
              const skillId = typeof skill === 'object' ? skill.id : `skill-${index}`;
              const skillName = typeof skill === 'object' ? skill.name : skill;
              const skillLevel = typeof skill === 'object' ? skill.level : 'intermediate';
              
              return (
                <div
                  key={skillId}
                  className={`p-3 rounded-lg border flex items-center justify-between ${getLevelColor(skillLevel)}`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{skillName}</p>
                      <p className="text-xs">{getLevelLabel(skillLevel)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skillId)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
