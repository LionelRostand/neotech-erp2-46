
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Clock } from 'lucide-react';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  const workSchedule = employee.workSchedule || {};
  
  const days = [
    { name: 'Lundi', key: 'monday' },
    { name: 'Mardi', key: 'tuesday' },
    { name: 'Mercredi', key: 'wednesday' },
    { name: 'Jeudi', key: 'thursday' },
    { name: 'Vendredi', key: 'friday' },
    { name: 'Samedi', key: 'saturday' },
    { name: 'Dimanche', key: 'sunday' }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2" />
          Horaires de travail
        </h3>
        
        {workSchedule && Object.keys(workSchedule).length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {days.map(day => (
                <div 
                  key={day.key} 
                  className={`p-3 rounded border flex justify-between items-center ${
                    workSchedule[day.key as keyof typeof workSchedule] ? 'bg-background' : 'bg-muted'
                  }`}
                >
                  <span className="font-medium">{day.name}</span>
                  <span>
                    {workSchedule[day.key as keyof typeof workSchedule] || 'Non travaillé'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t mt-4">
              <h4 className="text-md font-medium mb-2">Temps de travail</h4>
              <p className="text-muted-foreground">
                {employee.contract?.includes('Temps partiel') 
                  ? 'Temps partiel' 
                  : employee.contract?.includes('Temps plein') || !employee.contract
                    ? 'Temps plein'
                    : employee.contract}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground">Aucun horaire défini pour cet employé</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HorairesTab;
