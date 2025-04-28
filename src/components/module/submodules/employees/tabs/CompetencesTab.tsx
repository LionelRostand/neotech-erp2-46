
import React from 'react';
import { Employee, Skill } from '@/types/employee';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  // Helper to ensure values are strings
  const ensureString = (value: any) => {
    if (value === undefined || value === null) return '-';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  // Ensure skills is an array and filter out any null/undefined values
  const skills = Array.isArray(employee.skills) 
    ? employee.skills.filter(skill => skill !== null && skill !== undefined) 
    : [];

  // Define badge colors for different skill levels
  const skillLevelColors = {
    débutant: 'bg-blue-100 text-blue-800',
    intermédiaire: 'bg-green-100 text-green-800',
    avancé: 'bg-yellow-100 text-yellow-800',
    expert: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Compétences</h3>
      
      {skills.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => {
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
                  key={index} 
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
    </div>
  );
};

export default CompetencesTab;
