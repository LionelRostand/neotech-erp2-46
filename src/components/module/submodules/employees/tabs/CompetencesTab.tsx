
import React from 'react';
import { Employee, Skill } from '@/types/employee';
import { Badge } from '@/components/ui/badge';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  // Make sure skills is always an array and never undefined
  const skills = Array.isArray(employee.skills) ? employee.skills : [];

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
    // Skip invalid skills
    if (!skill) {
      return acc;
    }
    
    // Handle string skills or object skills
    const skillObj: Skill = typeof skill === 'string' 
      ? { id: `string-skill-${skill}`, name: skill, level: 'other' }
      : (skill as Skill);
    
    // Skip if somehow the skill doesn't have a valid level
    if (!skillObj.name || !skillObj.level) {
      return acc;
    }
    
    const level = skillObj.level || 'other';
    
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(skillObj);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Compétences</h3>
      
      {skills.length === 0 ? (
        <p className="text-gray-500">Aucune compétence enregistrée</p>
      ) : Object.keys(groupedSkills).length === 0 ? (
        <p className="text-gray-500">Aucune compétence valide trouvée</p>
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
