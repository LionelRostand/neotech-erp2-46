
import { useState, useEffect, useCallback } from 'react';
import { MaintenanceSchedule } from '../types';

// Extending MaintenanceSchedule to ensure technicianAssigned is required here
export interface MaintenanceScheduleWithTechnician extends MaintenanceSchedule {
  technicianAssigned: string;
}

export const useMaintenanceSchedule = (initialSchedules: MaintenanceScheduleWithTechnician[] = []) => {
  const [schedules, setSchedules] = useState<MaintenanceScheduleWithTechnician[]>(initialSchedules);
  
  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  const mapSchedules = useCallback((scheduleList: MaintenanceSchedule[]): MaintenanceScheduleWithTechnician[] => {
    return scheduleList.map(schedule => {
      return {
        ...schedule,
        technicianAssigned: typeof schedule.technicianAssigned === 'string' 
          ? schedule.technicianAssigned 
          : '',
        id: schedule.id || `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    });
  }, []);

  const addSchedule = useCallback((schedule: MaintenanceScheduleWithTechnician) => {
    setSchedules(prev => [...prev, schedule]);
  }, []);

  const updateSchedule = useCallback((id: string, updatedSchedule: Partial<MaintenanceScheduleWithTechnician>) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
      )
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  }, []);

  return {
    schedules,
    mapSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  };
};
