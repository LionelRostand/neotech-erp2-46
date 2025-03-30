
import { useMemo } from 'react';
import { MaintenanceSchedule } from '../types';

export const useMaintenanceSchedule = (
  maintenanceSchedules: MaintenanceSchedule[]
) => {
  const mapSchedules = useMemo(() => {
    return maintenanceSchedules.map(schedule => {
      // Ensure scheduledDate is always defined for MapMaintenanceSchedule
      const mapSchedule = {
        ...schedule,
        startDate: schedule.startDate || schedule.scheduledDate || new Date().toISOString(), // Default to current date if undefined
        endDate: schedule.endDate || schedule.scheduledDate || new Date().toISOString(), // Add endDate if not present
      };
      return mapSchedule;
    });
  }, [maintenanceSchedules]);

  return {
    mapSchedules,
  };
};
