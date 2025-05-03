
import React, { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddSkillDialog from './AddSkillDialog';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const { updateEmployee, isLoading } = useEmployeeActions();

  // Helper to ensure values are strings
  const ensureString = (value: any) => {
    if (value === undefined || value === null) return '-';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  // Ensure employee object and skills array both exist
  const safeEmployee = employee || {};
  
  // Ensure skills is an array and filter out any null/undefined values
  const skills = Array.isArray(safeEmployee.skills) 
    ? safeEmployee.skills.filter(skill => skill !== null && skill !== undefined) 
    : [];

  // Define badge colors for different skill levels
  const skillLevelColors = {
    débutant: 'bg-blue-100 text-blue-800',
    intermédiaire: 'bg-green-100 text-green-800',
    avancé: 'bg-yellow-100 text-yellow-800',
    expert: 'bg-purple-100 text-purple-800'
  };

  const handleAddSkill = async (newSkill: Skill) => {
    try {
      if (!employee || !employee.id) {
        toast.error("Impossible de mettre à jour l'employé: ID manquant");
        return;
      }
      
      const updatedSkills = [...skills, newSkill];
      await updateEmployee({
        id: employee.id,
        skills: updatedSkills
      });
      toast.success("Compétence ajoutée avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la compétence:', error);
      toast.error("Erreur lors de l'ajout de la compétence");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Compétences</h3>
        <Button 
          size="sm" 
          onClick={() => setIsAddSkillDialogOpen(true)}
          disabled={isLoading || !employee?.id}
        >
          <Plus className="h-4 w-4 mr-1" /> Ajouter une compétence
        </Button>
      </div>
      
      {skills && skills.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => {
              if (!skill) return null;
              
              // Handle both string and object types of skills
              const skillName = typeof skill === 'string' 
                ? skill 
                : ensureString((skill as Skill).name);
              
              // Default level if skill is just a string
              const skillLevel = typeof skill === 'string' 
                ? 'débutant' 
                : ensureString((skill as Skill).level);
              
              // Get the appropriate color class for the badge
              const colorClass = skillLevelColors[skillLevel as keyof typeof skillLevelColors] || 'bg-gray-100 text-gray-800';
              
              return (
                <div 
                  key={`skill-${index}-${skillName}`} 
                  className="p-3 border rounded-md flex justify-between items-center"
                >
                  <div>{skillName}</div>
                  <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
                    {skillLevel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            Aucune compétence n'a été enregistrée pour cet employé.
          </p>
        </div>
      )}

      <AddSkillDialog
        open={isAddSkillDialogOpen}
        onOpenChange={setIsAddSkillDialogOpen}
        onAddSkill={handleAddSkill}
      />
    </div>
  );
};

export default CompetencesTab;
