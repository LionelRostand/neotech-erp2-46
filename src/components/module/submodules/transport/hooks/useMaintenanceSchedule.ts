
import { useMemo } from 'react';
import { MaintenanceSchedule } from '../types';

export const useMaintenanceSchedule = (
  maintenanceSchedules: MaintenanceSchedule[]
) => {
  const mapSchedules = useMemo(() => {
    return maintenanceSchedules.map(schedule => {
      // Ensure startDate is always defined for MapMaintenanceSchedule
      const mapSchedule = {
        ...schedule,
        startDate: schedule.startDate || schedule.scheduledDate || new Date().toISOString(), // Default to current date if undefined
      };
      return mapSchedule;
    });
  }, [maintenanceSchedules]);

  return {
    mapSchedules,
  };
};
