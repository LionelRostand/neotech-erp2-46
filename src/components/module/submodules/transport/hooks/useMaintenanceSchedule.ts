
import { useState, useEffect, useCallback } from 'react';
import { VehicleMaintenanceSchedule } from '../types';

export interface MaintenanceSchedule extends VehicleMaintenanceSchedule {
  technicianAssigned: string;
}

export const useMaintenanceSchedule = (initialSchedules: MaintenanceSchedule[] = []) => {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(initialSchedules);
  
  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  const mapSchedules = useCallback((scheduleList: MaintenanceSchedule[]) => {
    return scheduleList.map(schedule => {
      return {
        ...schedule,
        technicianAssigned: typeof schedule.technicianAssigned === 'string' 
          ? schedule.technicianAssigned 
          : '',
      };
    });
  }, []);

  const addSchedule = useCallback((schedule: MaintenanceSchedule) => {
    setSchedules(prev => [...prev, schedule]);
  }, []);

  const updateSchedule = useCallback((id: string, updatedSchedule: Partial<MaintenanceSchedule>) => {
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
