
import React from 'react';
import { Employee, Schedule, WorkDay } from '@/types/employee';
import { Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface HorairesTabProps {
  employee: Employee;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  const schedule = employee.schedule || {
    monday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    thursday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    friday: { isWorkDay: true, shifts: [{ start: '09:00', end: '17:00' }] },
    saturday: { isWorkDay: false, shifts: [] },
    sunday: { isWorkDay: false, shifts: [] }
  };
  
  // Liste des jours de la semaine en français
  const weekDays = [
    { key: 'monday', name: 'Lundi' },
    { key: 'tuesday', name: 'Mardi' },
    { key: 'wednesday', name: 'Mercredi' },
    { key: 'thursday', name: 'Jeudi' },
    { key: 'friday', name: 'Vendredi' },
    { key: 'saturday', name: 'Samedi' },
    { key: 'sunday', name: 'Dimanche' }
  ];
  
  // Fonction pour formater les heures de travail
  const formatWorkHours = (day: WorkDay | undefined): string => {
    if (!day || !day.isWorkDay || !day.shifts || day.shifts.length === 0) {
      return 'Jour non travaillé';
    }
    
    return day.shifts.map(shift => `${shift.start} - ${shift.end}`).join(', ');
  };
  
  // Calculer le nombre d'heures travaillées par semaine
  const calculateWeeklyHours = (): number => {
    let totalMinutes = 0;
    
    weekDays.forEach(({ key }) => {
      const day = schedule[key as keyof Schedule];
      if (day?.isWorkDay && day.shifts) {
        day.shifts.forEach(shift => {
          const startParts = shift.start.split(':');
          const endParts = shift.end.split(':');
          
          const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1] || '0');
          const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1] || '0');
          
          totalMinutes += endMinutes - startMinutes;
        });
      }
    });
    
    return Math.round(totalMinutes / 60 * 10) / 10; // Arrondi à 1 décimale
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Horaires de travail</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-700" />
          <span className="text-blue-800 font-medium">Heures hebdomadaires:</span>
        </div>
        <span className="font-bold text-blue-800">{calculateWeeklyHours()}h</span>
      </div>
      
      <div className="grid gap-4">
        {weekDays.map(({ key, name }) => {
          const day = schedule[key as keyof Schedule];
          const isWorkDay = day?.isWorkDay || false;
          
          return (
            <div 
              key={key}
              className={`p-4 rounded-lg border ${
                isWorkDay ? 'border-green-100 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isWorkDay ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={`font-medium ${isWorkDay ? 'text-green-800' : 'text-gray-700'}`}>
                    {name}
                  </span>
                </div>
                
                <span className="text-sm">
                  {formatWorkHours(day)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorairesTab;
