
import React from 'react';
import { Employee, Schedule, WorkDay } from '@/types/employee';
import { Clock } from 'lucide-react';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  // If employee has no schedule, use a default empty schedule for display
  const schedule: Schedule = employee.schedule || {
    monday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    thursday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    friday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    saturday: { isWorkDay: false, shifts: [] },
    sunday: { isWorkDay: false, shifts: [] }
  };
  
  // Days of the week in French
  const weekdays = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];
  
  // Helper function to format the schedule display
  const formatDaySchedule = (day?: WorkDay) => {
    if (!day) return 'Non défini';
    
    if (!day.isWorkDay) return 'Jour non travaillé';
    
    if (!day.shifts || day.shifts.length === 0) return 'Horaires non définis';
    
    return day.shifts
      .map(shift => `${shift.start} - ${shift.end}`)
      .join(', ');
  };
  
  // Calculate total weekly hours
  const calculateTotalHours = () => {
    let totalMinutes = 0;
    
    for (const dayKey in schedule) {
      const day = schedule[dayKey as keyof Schedule];
      if (day?.isWorkDay && day.shifts) {
        for (const shift of day.shifts) {
          if (shift.start && shift.end) {
            const startMinutes = timeToMinutes(shift.start);
            const endMinutes = timeToMinutes(shift.end);
            if (startMinutes !== null && endMinutes !== null) {
              totalMinutes += endMinutes - startMinutes;
            }
          }
        }
      }
    }
    
    return (totalMinutes / 60).toFixed(1);
  };
  
  // Convert time string to minutes
  const timeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;
    
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    
    return hours * 60 + minutes;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Horaires de travail</h3>
        <div className="text-sm bg-gray-100 py-1 px-3 rounded-full">
          <span className="font-medium">Total hebdomadaire:</span>{' '}
          <span className="text-blue-600">{calculateTotalHours()}h</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jour
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horaires
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {weekdays.map(({ key, label }) => {
              const day = schedule[key as keyof Schedule];
              const isWorkDay = day?.isWorkDay;
              
              return (
                <tr key={key} className={isWorkDay ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDaySchedule(day)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isWorkDay ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Jour travaillé
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Repos
                      </span>
                    )}
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
