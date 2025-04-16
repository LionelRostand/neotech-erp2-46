
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  // Default work schedule if not provided
  const workSchedule = employee.workSchedule || {
    monday: '9:00 - 17:00',
    tuesday: '9:00 - 17:00',
    wednesday: '9:00 - 17:00',
    thursday: '9:00 - 17:00',
    friday: '9:00 - 17:00',
    saturday: '-',
    sunday: '-'
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Horaires de travail de {employee.firstName} {employee.lastName}</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Jour</span>
                <span className="font-medium">Horaires</span>
              </div>
              <div />
              
              <span>Lundi</span>
              <span>{workSchedule.monday || '-'}</span>
              
              <span>Mardi</span>
              <span>{workSchedule.tuesday || '-'}</span>
              
              <span>Mercredi</span>
              <span>{workSchedule.wednesday || '-'}</span>
              
              <span>Jeudi</span>
              <span>{workSchedule.thursday || '-'}</span>
              
              <span>Vendredi</span>
              <span>{workSchedule.friday || '-'}</span>
              
              <span>Samedi</span>
              <span>{workSchedule.saturday || '-'}</span>
              
              <span>Dimanche</span>
              <span>{workSchedule.sunday || '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorairesTab;
