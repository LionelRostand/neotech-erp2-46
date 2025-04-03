
import { useState } from 'react';
import { addDays, isPast } from 'date-fns';
import { MaintenanceSchedule, MaintenanceScheduleWithTechnician } from '../types';

export interface UseMaintenanceScheduleProps {
  onUpdate?: (data: MaintenanceScheduleWithTechnician[]) => void;
  onError?: (error: Error) => void;
}

export const useMaintenanceSchedule = (props: UseMaintenanceScheduleProps = {}) => {
  const [schedules, setSchedules] = useState<MaintenanceScheduleWithTechnician[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = async (vehicleId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // Mock data for now
      const mockData: MaintenanceScheduleWithTechnician[] = [
        {
          id: "ms1",
          vehicleId: "v1",
          scheduledDate: addDays(new Date(), -5).toISOString(),
          type: "oil_change",
          description: "Changement d'huile et filtres",
          estimatedDuration: 60,
          status: "overdue" as "scheduled" | "in-progress" | "completed" | "cancelled" | "overdue",
          priority: "high",
          technicianAssigned: "Pierre Durant",
          completed: false,
          startDate: addDays(new Date(), -5).toISOString(),
          endDate: addDays(new Date(), -5).toISOString()
        },
        {
          id: "ms2",
          vehicleId: "v2",
          scheduledDate: addDays(new Date(), 2).toISOString(),
          type: "inspection",
          description: "Inspection annuelle obligatoire",
          estimatedDuration: 120,
          status: "scheduled",
          priority: "medium",
          technicianAssigned: "Marie Lambert",
          completed: false,
          startDate: addDays(new Date(), 2).toISOString(),
          endDate: addDays(new Date(), 2).toISOString()
        }
      ];

      // If a vehicleId is provided, filter the data
      const filteredData = vehicleId 
        ? mockData.filter(item => item.vehicleId === vehicleId)
        : mockData;

      setSchedules(filteredData);
      
      if (props.onUpdate) {
        props.onUpdate(filteredData);
      }
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to fetch maintenance schedules');
      setError(error);
      
      if (props.onError) {
        props.onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, data: Partial<MaintenanceSchedule>) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // Simulate an update with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the local state
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === id ? { ...schedule, ...data } : schedule
      );

      setSchedules(updatedSchedules);
      
      if (props.onUpdate) {
        props.onUpdate(updatedSchedules);
      }
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to update maintenance schedule');
      setError(error);
      
      if (props.onError) {
        props.onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    updateSchedule
  };
};

export type { MaintenanceScheduleWithTechnician };
