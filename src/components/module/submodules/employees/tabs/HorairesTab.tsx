
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">Horaires de travail</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <p className="font-medium">Lundi</p>
              <p>{workSchedule.monday}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Mardi</p>
              <p>{workSchedule.tuesday}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Mercredi</p>
              <p>{workSchedule.wednesday}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Jeudi</p>
              <p>{workSchedule.thursday}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <p className="font-medium">Vendredi</p>
              <p>{workSchedule.friday}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Samedi</p>
              <p>{workSchedule.saturday || '-'}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Dimanche</p>
              <p>{workSchedule.sunday || '-'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorairesTab;
