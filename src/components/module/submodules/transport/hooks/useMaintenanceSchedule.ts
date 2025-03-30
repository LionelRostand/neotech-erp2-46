
import { useMemo } from 'react';
import { MaintenanceSchedule as VehicleMaintenanceSchedule } from '../types/vehicle-types';
import { MaintenanceSchedule as MapMaintenanceSchedule } from '../types/map-types';

export const useMaintenanceSchedule = (
  maintenanceSchedules: VehicleMaintenanceSchedule[]
) => {
  const mapSchedules = useMemo(() => {
    return maintenanceSchedules.map(schedule => {
      // Ensure startDate is always defined for MapMaintenanceSchedule
      const mapSchedule: MapMaintenanceSchedule = {
        ...schedule,
        startDate: schedule.startDate || new Date().toISOString(), // Default to current date if undefined
      };
      return mapSchedule;
    });
  }, [maintenanceSchedules]);

  return {
    mapSchedules,
  };
};
