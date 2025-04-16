
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateEmployeeSkills } from '@/components/module/submodules/employees/services/employeeService';

interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated: () => Promise<void>;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee, onEmployeeUpdated }) => {
  const [skills, setSkills] = useState<string[]>(employee.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Avoid duplicates (case insensitive)
    if (skills.some(skill => skill.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error("Cette compétence existe déjà");
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    // Reset skills to employee's current skills when starting to edit
    setSkills(employee.skills || []);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setSkills(employee.skills || []);
    setNewSkill('');
  };

  const handleSaveSkills = async () => {
    if (!employee.id) return;
    
    try {
      setIsSaving(true);
      
      const success = await updateEmployeeSkills(employee.id, skills);
      
      if (success) {
        toast.success("Compétences enregistrées avec succès");
        setIsEditing(false);
        setNewSkill('');
        await onEmployeeUpdated();
      } else {
        toast.error("Erreur lors de l'enregistrement des compétences");
      }
    } catch (error) {
      console.error("Error saving skills:", error);
      toast.error("Erreur lors de l'enregistrement des compétences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compétences de {employee.firstName} {employee.lastName}</h2>
        
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={handleStartEditing}>
            Modifier
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancelEditing}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSaveSkills}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ajouter une compétence"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 group">
                    {skill}
                    <X 
                      className="h-3 w-3 ml-2 cursor-pointer" 
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </Badge>
                ))}
                
                {skills.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    Aucune compétence ajoutée
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(employee.skills || []).length > 0 ? (
                employee.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Aucune compétence enregistrée
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencesTab;
