
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  const workSchedule = employee.workSchedule || {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 17:00',
  };
  
  const weekDays = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Horaires de travail</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weekDays.map(day => {
              const schedule = workSchedule[day.key as keyof typeof workSchedule];
              const isWorkDay = !!schedule && schedule !== 'off' && schedule !== '';
              
              return (
                <div key={day.key} className="flex items-center p-3 border rounded-md">
                  <div className={`p-2 rounded-md ${isWorkDay ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <Clock className={`h-5 w-5 ${isWorkDay ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{day.label}</p>
                    <p className="text-sm text-gray-500">
                      {isWorkDay ? schedule : 'Non travaillé'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorairesTab;
