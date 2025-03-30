
import { useState, useEffect } from 'react';
import { MaintenanceSchedule as VehicleMaintenanceSchedule } from '../types/vehicle-types';
import { MaintenanceSchedule as MapMaintenanceSchedule } from '../types/map-types';

// This hook converts between vehicle-types and map-types MaintenanceSchedule
export const useMaintenanceSchedule = (schedules: VehicleMaintenanceSchedule[]) => {
  const [mapSchedules, setMapSchedules] = useState<MapMaintenanceSchedule[]>([]);
  
  useEffect(() => {
    // Convert vehicle maintenance schedules to map maintenance schedules
    const converted = schedules.map(schedule => ({
      ...schedule,
      // Ensure startDate is not optional
      startDate: schedule.startDate || new Date().toISOString(),
    }));
    
    setMapSchedules(converted);
  }, [schedules]);
  
  return { mapSchedules };
};
