
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface CompetencesTabProps {
  employee: Employee;
}

export const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<(Skill | string)[]>(employee.skills || []);
  const { updateEmployee } = useEmployeeActions();
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    
    // Mettre à jour l'employé avec les nouvelles compétences
    updateEmployee({
      id: employee.id,
      skills: updatedSkills
    }).then(() => {
      toast.success('Compétence ajoutée avec succès');
      setNewSkill('');
    }).catch(error => {
      console.error('Erreur lors de l\'ajout de la compétence:', error);
      toast.error('Erreur lors de l\'ajout de la compétence');
    });
  };
  
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    
    // Mettre à jour l'employé avec les compétences restantes
    updateEmployee({
      id: employee.id,
      skills: updatedSkills
    }).then(() => {
      toast.success('Compétence supprimée avec succès');
    }).catch(error => {
      console.error('Erreur lors de la suppression de la compétence:', error);
      toast.error('Erreur lors de la suppression de la compétence');
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Compétences</h3>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
              >
                <span>{typeof skill === 'string' ? skill : skill.name}</span>
                <button 
                  onClick={() => handleRemoveSkill(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune compétence enregistrée</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
            Ajouter une compétence
          </label>
          <input
            type="text"
            id="skill"
            className="w-full p-2 border rounded-md"
            placeholder="Nom de la compétence"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </div>
        <Button onClick={handleAddSkill}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};
