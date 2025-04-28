
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee, Schedule, WorkDay } from '@/types/employee';

interface HorairesTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Lundi' },
  { id: 'tuesday', label: 'Mardi' },
  { id: 'wednesday', label: 'Mercredi' },
  { id: 'thursday', label: 'Jeudi' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
  { id: 'sunday', label: 'Dimanche' },
];

const defaultWorkDay: WorkDay = {
  isWorkDay: false,
  shifts: [{ start: '09:00', end: '17:00' }]
};

const HorairesTabEdit: React.FC<HorairesTabEditProps> = ({ employee, onSave, onCancel }) => {
  // Initialize schedule with employee data or default values
  const [schedule, setSchedule] = useState<Schedule>(() => {
    if (employee.schedule) return employee.schedule;
    
    const defaultSchedule: Schedule = {};
    daysOfWeek.forEach(day => {
      defaultSchedule[day.id as keyof Schedule] = { ...defaultWorkDay };
    });
    
    return defaultSchedule;
  });

  const handleCheckboxChange = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof Schedule],
        isWorkDay: !prev[day as keyof Schedule]?.isWorkDay
      }
    }));
  };

  const handleTimeChange = (day: string, shiftIndex: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => {
      const daySchedule = prev[day as keyof Schedule];
      if (!daySchedule) return prev;
      
      const updatedShifts = [...daySchedule.shifts];
      updatedShifts[shiftIndex] = {
        ...updatedShifts[shiftIndex],
        [field]: value
      };
      
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          shifts: updatedShifts
        }
      };
    });
  };

  const handleAddShift = (day: string) => {
    setSchedule(prev => {
      const daySchedule = prev[day as keyof Schedule];
      if (!daySchedule) return prev;
      
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          shifts: [...daySchedule.shifts, { start: '09:00', end: '17:00' }]
        }
      };
    });
  };

  const handleRemoveShift = (day: string, shiftIndex: number) => {
    setSchedule(prev => {
      const daySchedule = prev[day as keyof Schedule];
      if (!daySchedule || daySchedule.shifts.length <= 1) return prev;
      
      const updatedShifts = daySchedule.shifts.filter((_, i) => i !== shiftIndex);
      
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          shifts: updatedShifts
        }
      };
    });
  };

  const handleSave = () => {
    onSave({ schedule });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {daysOfWeek.map(day => (
          <div key={day.id} className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox 
                id={`workday-${day.id}`}
                checked={schedule[day.id as keyof Schedule]?.isWorkDay}
                onCheckedChange={() => handleCheckboxChange(day.id)}
              />
              <Label htmlFor={`workday-${day.id}`} className="font-medium">{day.label}</Label>
            </div>
            
            {schedule[day.id as keyof Schedule]?.isWorkDay && (
              <div className="space-y-3 ml-6">
                {schedule[day.id as keyof Schedule]?.shifts.map((shift, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div>
                      <Label htmlFor={`${day.id}-start-${index}`} className="sr-only">Début</Label>
                      <Input
                        id={`${day.id}-start-${index}`}
                        type="time"
                        value={shift.start}
                        onChange={(e) => handleTimeChange(day.id, index, 'start', e.target.value)}
                        className="w-[120px]"
                      />
                    </div>
                    <span>à</span>
                    <div>
                      <Label htmlFor={`${day.id}-end-${index}`} className="sr-only">Fin</Label>
                      <Input
                        id={`${day.id}-end-${index}`}
                        type="time"
                        value={shift.end}
                        onChange={(e) => handleTimeChange(day.id, index, 'end', e.target.value)}
                        className="w-[120px]"
                      />
                    </div>
                    {schedule[day.id as keyof Schedule]?.shifts.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveShift(day.id, index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddShift(day.id)}
                >
                  + Ajouter un créneau
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default HorairesTabEdit;
