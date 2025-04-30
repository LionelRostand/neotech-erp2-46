
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X, Award } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CompetencesTabProps {
  employee: Employee;
}

const skillLevels = [
  { value: 'débutant', label: 'Débutant' },
  { value: 'intermédiaire', label: 'Intermédiaire' },
  { value: 'avancé', label: 'Avancé' },
  { value: 'expert', label: 'Expert' }
];

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const [skills, setSkills] = useState<Skill[]>(
    (Array.isArray(employee.skills) 
      ? employee.skills.map(skill => 
          typeof skill === 'string' 
            ? { id: uuidv4(), name: skill, level: 'intermédiaire' } 
            : skill
        )
      : []
    ) || []
  );
  
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState('intermédiaire');
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skillToAdd: Skill = {
      id: uuidv4(),
      name: newSkill.trim(),
      level: newLevel
    };
    
    setSkills([...skills, skillToAdd]);
    setNewSkill('');
    setNewLevel('intermédiaire');
  };
  
  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Compétences</h3>
      </div>
      
      <div className="grid gap-4">
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-xs text-gray-500">Niveau: {skill.level}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-md">
            <Award className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p className="text-gray-500">Aucune compétence enregistrée</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-3">Ajouter une compétence</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input 
              placeholder="Nom de la compétence" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={newLevel} onValueChange={setNewLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
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
          <Button onClick={handleAddSkill} className="shrink-0">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompetencesTab;
