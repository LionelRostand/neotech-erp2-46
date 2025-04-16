
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateEmployeeSkills } from '../services/employeeService';

interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated: () => void;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ 
  employee, 
  onEmployeeUpdated, 
  isEditing: externalIsEditing, 
  onFinishEditing 
}) => {
  const [skills, setSkills] = useState<string[]>(employee.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (externalIsEditing !== undefined) {
      setIsEditing(externalIsEditing);
    }
  }, [externalIsEditing]);

  useEffect(() => {
    // Update local skills state when employee skills change
    console.log("Employee skills changed:", employee.skills);
    setSkills(employee.skills || []);
  }, [employee.skills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    if (skills.includes(newSkill.trim())) {
      toast.error("Cette compétence existe déjà");
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSaveSkills = async () => {
    try {
      setIsSaving(true);
      console.log("Saving skills for employee:", employee.id, skills);
      
      // Correct the call to updateEmployeeSkills
      await updateEmployeeSkills(employee.id, skills);
      
      // After successful save, call the onEmployeeUpdated function
      onEmployeeUpdated();
      
      if (onFinishEditing) {
        onFinishEditing();
      } else {
        setIsEditing(false);
      }
      
      toast.success("Compétences mises à jour avec succès");
    } catch (error) {
      console.error("Error saving skills:", error);
      toast.error("Erreur lors de la sauvegarde des compétences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Compétences</CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSaveSkills}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ajouter une compétence..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button 
                type="button" 
                size="icon" 
                onClick={handleAddSkill}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} className="py-1 pl-2 pr-1 flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    className="ml-1 rounded-full hover:bg-gray-200 p-1"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="py-1">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune compétence renseignée.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetencesTab;
