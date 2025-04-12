
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';

interface CompetencesTabProps {
  employee: Employee;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee }) => {
  const skills = employee.skills || [];
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Compétences</h3>
        
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
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
