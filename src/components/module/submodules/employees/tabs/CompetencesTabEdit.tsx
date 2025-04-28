
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee, Skill } from '@/types/employee';
import { Plus, X } from 'lucide-react';

interface CompetencesTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const CompetencesTabEdit: React.FC<CompetencesTabEditProps> = ({ employee, onSave, onCancel }) => {
  // Convert any string skills to Skill objects for editing
  const initialSkills = () => {
    const employeeSkills = employee.skills || [];
    return employeeSkills
      .filter(skill => skill !== null && skill !== undefined)
      .map(skill => {
        if (typeof skill === 'string') {
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: skill,
            level: 'débutant'
          };
        }
        // Handle potential object skill with missing properties
        if (typeof skill === 'object' && skill !== null) {
          const skillObj = skill as Skill;
          return {
            id: skillObj.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: skillObj.name || 'Compétence sans nom',
            level: skillObj.level || 'débutant'
          };
        }
        // Fallback for unexpected cases
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: 'Compétence inconnue',
          level: 'débutant'
        };
      });
  };

  const [skills, setSkills] = useState<Skill[]>(initialSkills());
  const [newSkill, setNewSkill] = useState({ name: '', level: 'débutant' });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill, id: Date.now().toString() }]);
      setNewSkill({ name: '', level: 'débutant' });
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleSkillLevelChange = (id: string, level: string) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    ));
  };

  const handleSave = () => {
    onSave({ skills });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Compétences actuelles</h3>
        
        {skills.length === 0 ? (
          <p className="text-gray-500">Aucune compétence ajoutée</p>
        ) : (
          <div className="space-y-3">
            {skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-2 p-2 border rounded-md">
                <div className="flex-grow">
                  {typeof skill.name === 'object' ? JSON.stringify(skill.name) : skill.name}
                </div>
                <Select 
                  value={skill.level} 
                  onValueChange={(value) => handleSkillLevelChange(skill.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="avancé">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveSkill(skill.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Ajouter une compétence</h3>
        <div className="flex gap-2">
          <div className="flex-grow">
            <Label htmlFor="skillName" className="sr-only">Nom de la compétence</Label>
            <Input
              id="skillName"
              placeholder="Nom de la compétence"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
          </div>
          <Select 
            value={newSkill.level} 
            onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="débutant">Débutant</SelectItem>
              <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="avancé">Avancé</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAddSkill}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default CompetencesTabEdit;
