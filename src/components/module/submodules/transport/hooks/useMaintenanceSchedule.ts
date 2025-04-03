
import { useState, useEffect } from 'react';
import { MaintenanceSchedule, MaintenanceScheduleWithTechnician } from '../types';

export const useMaintenanceSchedule = (vehicleId?: string) => {
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceScheduleWithTechnician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaintenanceSchedules = async () => {
      try {
        setLoading(true);
        // Simulated API call with mock data
        const mockSchedules: MaintenanceScheduleWithTechnician[] = generateMockSchedules(vehicleId);
        setMaintenanceSchedules(mockSchedules);
        setLoading(false);
      } catch (err) {
        setError('Error fetching maintenance schedules');
        setLoading(false);
      }
    };

    fetchMaintenanceSchedules();
  }, [vehicleId]);

  return { maintenanceSchedules, loading, error };
};

const generateMockSchedules = (vehicleId?: string): MaintenanceScheduleWithTechnician[] => {
  const baseSchedules: MaintenanceScheduleWithTechnician[] = [
    {
      id: 'maint-001',
      vehicleId: vehicleId || 'veh-001',
      scheduledDate: '2023-12-15',
      startDate: '2023-12-15T09:00:00',
      endDate: '2023-12-15T12:00:00',
      type: 'oil_change',
      description: 'Changement d\'huile et filtres',
      estimatedDuration: 180,
      technicianAssigned: 'tech-001',
      technician: 'Jean Dupont',
      technicianName: 'Jean Dupont',
      technicianContact: '06 12 34 56 78',
      serviceCenterId: 'sc-001',
      serviceCenterName: 'Garage Central',
      status: 'scheduled',
      priority: 'medium',
      completed: false,
      notes: 'Vérifier également les plaquettes de frein'
    },
    {
      id: 'maint-002',
      vehicleId: vehicleId || 'veh-002',
      scheduledDate: '2023-12-20',
      startDate: '2023-12-20T14:00:00',
      endDate: '2023-12-20T17:00:00',
      type: 'tire_replacement',
      description: 'Remplacement des pneus',
      estimatedDuration: 180,
      technicianAssigned: 'tech-002',
      technician: 'Marie Dubois',
      technicianName: 'Marie Dubois',
      technicianContact: '06 23 45 67 89',
      serviceCenterId: 'sc-002',
      serviceCenterName: 'Pneus Express',
      status: 'scheduled',
      priority: 'high',
      completed: false,
      notes: 'Monter les pneus hiver'
    }
  ];

  if (vehicleId) {
    return baseSchedules.filter(schedule => schedule.vehicleId === vehicleId);
  }

  return baseSchedules;
};

export default useMaintenanceSchedule;
