
import React from 'react';
import { Employee, WorkDay } from '@/types/employee';
import { Clock, CalendarRange } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HorairesTabProps {
  employee: Employee;
}

const weekdayNames = [
  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"
];

const weekdayKeys = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

const formatTime = (timeStr: string): string => {
  // Format 'HH:MM' to a more readable format if needed
  return timeStr;
};

const HorairesTab: React.FC<HorairesTabProps> = ({ employee }) => {
  const schedule = employee.schedule || {};
  
  const hasSchedule = Object.keys(schedule).length > 0;
  
  const getWorkDay = (key: string): WorkDay | undefined => {
    return schedule[key];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Horaires de travail</h3>
      </div>
      
      {hasSchedule ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weekdayKeys.map((day, index) => {
                const workDay = getWorkDay(day);
                
                return (
                  <TableRow key={day}>
                    <TableCell className="font-medium">{weekdayNames[index]}</TableCell>
                    <TableCell>
                      {workDay ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          workDay.isWorkDay 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {workDay.isWorkDay ? 'Travaillé' : 'Non travaillé'}
                        </span>
                      ) : 'Non défini'}
                    </TableCell>
                    <TableCell>
                      {workDay && workDay.isWorkDay && workDay.shifts && workDay.shifts.length > 0 
                        ? workDay.shifts.map((shift, i) => (
                          <div key={i} className="text-sm">
                            {formatTime(shift.start)} - {formatTime(shift.end)}
                          </div>
                        ))
                        : '—'
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <Clock className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-500">Aucun horaire défini pour cet employé</p>
        </div>
      )}
    </div>
  );
};

export default HorairesTab;
