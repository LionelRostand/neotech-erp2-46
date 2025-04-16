
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award } from 'lucide-react';
import { Employee } from '@/types/employee';

interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ employee, onEmployeeUpdated }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Award className="h-5 w-5 mr-2" />
            Compétences
          </h3>
          
          {employee.skills && employee.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune compétence enregistrée</p>
          )}
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium flex items-center mb-4">
            <GraduationCap className="h-5 w-5 mr-2" />
            Formation
          </h3>
          
          {employee.education && employee.education.length > 0 ? (
            <div className="space-y-4">
              {employee.education.map((education, index) => (
                <div key={index} className="border-l-2 pl-4 border-primary/30">
                  <p className="font-medium">{education.degree}</p>
                  <p className="text-sm text-muted-foreground">{education.school}</p>
                  <p className="text-sm">{education.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune formation enregistrée</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetencesTab;
