
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Save, Trash, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateEmployeeSkills } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ 
  employee,
  onEmployeeUpdated,
  isEditing: isEditingProp = false,
  onFinishEditing
}) => {
  const [isEditing, setIsEditing] = useState(isEditingProp);
  const [skills, setSkills] = useState<string[]>(employee.skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setSkills(employee.skills || []);
    setNewSkill('');
    setIsEditing(false);
    if (onFinishEditing) {
      onFinishEditing();
    }
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSave = async () => {
    try {
      // Update employee in the database with the new skills
      await updateEmployeeSkills(COLLECTIONS.HR.EMPLOYEES, employee.id, skills);
      
      // Create updated employee object with new skills
      const updatedEmployee = {
        ...employee,
        skills
      };
      
      toast.success('Compétences mises à jour avec succès');
      
      // If an update callback was provided, call it with the updated employee
      if (typeof onEmployeeUpdated === 'function') {
        onEmployeeUpdated(updatedEmployee);
      }
      
      setIsEditing(false);
      if (onFinishEditing) {
        onFinishEditing();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des compétences:', error);
      toast.error('Erreur lors de la mise à jour des compétences');
    }
  };
  
  // Use isEditingProp if it's provided
  React.useEffect(() => {
    setIsEditing(isEditingProp);
  }, [isEditingProp]);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Compétences</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle compétence"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucune compétence enregistrée</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-muted-foreground text-sm">Aucune compétence enregistrée</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetencesTab;
