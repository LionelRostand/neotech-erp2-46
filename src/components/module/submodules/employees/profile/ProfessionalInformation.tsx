
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Building, User } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface ProfessionalInformationProps {
  employee: Employee;
  showManagerOption?: boolean;
}

const ProfessionalInformation = ({ 
  employee,
  showManagerOption = true 
}: ProfessionalInformationProps) => {
  const { employees } = useEmployeeData();

  const getManagerName = (managerId: string): string => {
    if (!managerId) return 'Non spécifié';
    const manager = employees.find(emp => emp.id === managerId);
    return manager 
      ? `${manager.firstName} ${manager.lastName}`
      : employee.manager || 'Non spécifié';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations professionnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {employee.position && (
          <>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Poste
              </h4>
              <p>{employee.position}</p>
            </div>
            <Separator />
          </>
        )}
        
        {employee.department && (
          <>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Département
              </h4>
              <p>{employee.department}</p>
            </div>
            <Separator />
          </>
        )}
        
        <div className="space-y-1">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Responsable
          </h4>
          <p>{employee.managerId ? getManagerName(employee.managerId) : 'Non spécifié'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalInformation;
