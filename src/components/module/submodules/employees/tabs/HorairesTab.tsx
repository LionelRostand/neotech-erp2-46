
import React from 'react';
import { Employee, WorkDay, Schedule } from '@/types/employee';
import { Check, X } from 'lucide-react';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  const schedule = employee.schedule || {};
  
  const daysOfWeek = [
    { id: 'monday', label: 'Lundi' },
    { id: 'tuesday', label: 'Mardi' },
    { id: 'wednesday', label: 'Mercredi' },
    { id: 'thursday', label: 'Jeudi' },
    { id: 'friday', label: 'Vendredi' },
    { id: 'saturday', label: 'Samedi' },
    { id: 'sunday', label: 'Dimanche' },
  ];

  const formatShifts = (day: WorkDay | undefined) => {
    if (!day || !day.isWorkDay || !day.shifts || day.shifts.length === 0) {
      return '-';
    }

    return day.shifts.map((shift, index) => (
      <div key={index} className="text-sm">
        {shift.start} - {shift.end}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Horaires de travail</h3>
      
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Travaillé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horaires
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {daysOfWeek.map((day) => {
              const daySchedule = schedule[day.id as keyof Schedule];
              
              return (
                <tr key={day.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{day.label}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {daySchedule?.isWorkDay ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {formatShifts(daySchedule)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorairesTab;
