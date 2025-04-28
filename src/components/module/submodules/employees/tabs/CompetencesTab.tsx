
import React from 'react';
import { Employee, Skill } from '@/types/employee';
import { Badge } from '@/components/ui/badge';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const skills = employee.skills || [];

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'débutant':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'intermédiaire':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'avancé':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'expert':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return '';
    }
  };

  // Make sure we're only grouping skills that are proper objects with level property
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    // Skip invalid skills or string skills
    if (!skill || typeof skill !== 'object' || !('level' in skill)) {
      return acc;
    }
    
    const level = skill.level || 'other';
    
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(skill as Skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Compétences</h3>
      
      {skills.length === 0 ? (
        <p className="text-gray-500">Aucune compétence enregistrée</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([level, levelSkills]) => (
            <div key={level} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 capitalize">{level}</h4>
              <div className="flex flex-wrap gap-2">
                {levelSkills.map(skill => (
                  <Badge key={skill.id} className={getBadgeColor(level)}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetencesTab;
