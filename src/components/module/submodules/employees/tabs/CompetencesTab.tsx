
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save, Edit } from 'lucide-react';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { updateEmployee } from '../services/employeeService';

interface CompetencesTabProps {
  employee: Employee;
  onUpdate?: (updatedEmployee: Employee) => void;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee, onUpdate }) => {
  const [skills, setSkills] = useState<string[]>(employee.skills || []);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Vérifier si la compétence existe déjà
    if (skills.includes(newSkill.trim())) {
      toast.error('Cette compétence existe déjà');
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSaveSkills = async () => {
    if (!employee.id) {
      toast.error('ID de l\'employé manquant');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Mettre à jour l'employé dans Firestore
      const success = await updateEmployee(employee.id, { skills });
      
      if (success) {
        toast.success('Compétences mises à jour avec succès');
        setIsEditing(false);
        // Mettre à jour l'employé dans le composant parent si nécessaire
        if (onUpdate) {
          onUpdate({
            ...employee,
            skills
          });
        }
      } else {
        toast.error('Erreur lors de la mise à jour des compétences');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des compétences:', error);
      toast.error('Erreur lors de la mise à jour des compétences');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Compétences</h3>
          {!isEditing ? (
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveSkills}
              disabled={isUpdating}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          )}
        </div>
        
        {isEditing && (
          <div className="flex mb-4 gap-2">
            <Input
              placeholder="Ajouter une compétence"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddSkill} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={`px-3 py-1 text-sm ${isEditing ? 'pr-1' : ''}`}
              >
                {skill}
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 p-1 rounded-full hover:bg-gray-300/20"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">Aucune compétence renseignée</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetencesTab;
