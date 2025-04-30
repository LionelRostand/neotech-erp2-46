
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const { updateEmployee } = useEmployeeActions();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize skills from employee or as empty array
  const skills = Array.isArray(employee.skills) 
    ? employee.skills 
    : [];
  
  // Get skill level display
  const getSkillLevelDisplay = (level: string): string => {
    switch(level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return level || 'Non spécifié';
    }
  };
  
  // Get skill level color
  const getSkillLevelColor = (level: string): string => {
    switch(level) {
      case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format skill for display
  const formatSkill = (skill: string | Skill): { name: string; level: string; } => {
    if (typeof skill === 'string') {
      return { name: skill, level: 'intermediate' };
    }
    return { name: skill.name || '', level: skill.level || 'intermediate' };
  };
  
  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error('Veuillez entrer un nom de compétence');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newSkillObject: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkill.trim(),
        level: skillLevel
      };
      
      // Create a new array with existing skills plus the new one
      const updatedSkills = [...skills, newSkillObject];
      
      // Update employee with new skills
      await updateEmployee({
        id: employee.id,
        skills: updatedSkills
      });
      
      toast.success('Compétence ajoutée avec succès');
      setNewSkill('');
      setSkillLevel('intermediate');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Erreur lors de l\'ajout de la compétence');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = async (skillToRemove: string | Skill) => {
    setIsLoading(true);
    
    try {
      const nameToRemove = typeof skillToRemove === 'string' 
        ? skillToRemove 
        : skillToRemove.name;
      
      // Filter out the skill to remove
      const updatedSkills = skills.filter(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        return skillName !== nameToRemove;
      });
      
      // Update employee with filtered skills
      await updateEmployee({
        id: employee.id,
        skills: updatedSkills
      });
      
      toast.success('Compétence supprimée avec succès');
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Erreur lors de la suppression de la compétence');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compétences</h3>
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Ajouter une compétence
          </Button>
        )}
      </div>
      
      {isAdding && (
        <div className="border rounded-md p-4 space-y-4 bg-gray-50">
          <h4 className="font-medium">Nouvelle compétence</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="skill-name" className="block text-sm font-medium text-gray-700">
                Nom de la compétence
              </label>
              <Input
                id="skill-name"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: JavaScript, Leadership, Communication..."
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="skill-level" className="block text-sm font-medium text-gray-700">
                Niveau
              </label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger id="skill-level" className="w-full mt-1">
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Débutant</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdding(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                size="sm"
                onClick={handleAddSkill}
                disabled={isLoading || !newSkill.trim()}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {skills.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">Aucune compétence enregistrée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill, index) => {
            const formattedSkill = formatSkill(skill);
            return (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div>
                  <div className="font-medium">{formattedSkill.name}</div>
                  <Badge 
                    variant="outline" 
                    className={getSkillLevelColor(formattedSkill.level)}
                  >
                    {getSkillLevelDisplay(formattedSkill.level)}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={isLoading}
                >
                  Retirer
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompetencesTab;
