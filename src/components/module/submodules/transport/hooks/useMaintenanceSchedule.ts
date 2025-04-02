
import { useState, useEffect } from 'react';
import { MaintenanceSchedule } from '../types/vehicle-types';

// Ensure the hook expects the right type - with technicianAssigned as required
export interface MaintenanceScheduleWithTechnician extends Omit<MaintenanceSchedule, 'technicianAssigned'> {
  technicianAssigned: string;
  id?: string;
}

export const useMaintenanceSchedule = (schedules: MaintenanceScheduleWithTechnician[]) => {
  const [mapSchedules, setMapSchedules] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [upcomingTasks, setUpcomingTasks] = useState<MaintenanceScheduleWithTechnician[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<MaintenanceScheduleWithTechnician[]>([]);

  useEffect(() => {
    // Format schedules for map display
    const formattedSchedules = schedules.map(schedule => {
      const date = new Date(schedule.scheduledDate);
      const today = new Date();

      let status = schedule.status;
      let cssClass = 'bg-blue-100 border-blue-300 text-blue-800';
      
      if (date < today && status !== 'completed') {
        status = 'overdue';
        cssClass = 'bg-red-100 border-red-300 text-red-800';
      } else if (status === 'completed') {
        cssClass = 'bg-green-100 border-green-300 text-green-800';
      }
      
      return {
        ...schedule,
        id: schedule.id || `schedule-${Math.random().toString(36).substr(2, 9)}`,
        startDate: schedule.scheduledDate,
        endDate: schedule.scheduledDate,
        title: `${schedule.type}: ${schedule.description}`,
        technician: schedule.technicianAssigned,
        tag: status,
        cssClass
      };
    });
    
    setMapSchedules(formattedSchedules);
    
    // Set upcoming and overdue tasks
    const today = new Date();
    const upcoming = schedules.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      return taskDate >= today && task.status !== 'completed';
    });
    
    const overdue = schedules.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      return taskDate < today && task.status !== 'completed';
    });
    
    setUpcomingTasks(upcoming);
    setOverdueTasks(overdue);
    
  }, [schedules]);

  return {
    mapSchedules,
    currentMonth,
    setCurrentMonth,
    upcomingTasks,
    overdueTasks
  };
};
