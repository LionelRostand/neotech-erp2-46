
import React from 'react';
import { Employee } from '@/types/employee';

export interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated: () => Promise<void>;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee, onEmployeeUpdated }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Compétences de {employee.firstName} {employee.lastName}</h2>
      
      <div className="space-y-6">
        {/* Skills section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Compétences</h3>
          {employee.skills && employee.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {skill}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune compétence enregistrée</p>
          )}
        </div>
        
        {/* Education section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Formation</h3>
          {employee.education && employee.education.length > 0 ? (
            <div className="space-y-3">
              {employee.education.map((edu, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.school}, {edu.year}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune formation enregistrée</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetencesTab;
