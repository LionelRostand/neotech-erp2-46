
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Alert {
  id: string;
  title: string;
  type: 'Contrat' | 'Absence' | 'Document' | 'Congé' | 'Évaluation' | 'Autre';
  severity: 'Haute' | 'Moyenne' | 'Basse';
  createdDate: string;
  status: 'Active' | 'Résolue' | 'En attente';
  description?: string;
  employeeId?: string;
  employeeName?: string;
  employeePhoto?: string;
  dueDate?: string;
  resolvedDate?: string;
  assignedToId?: string;
  assignedToName?: string;
}

/**
 * Hook pour accéder aux données des alertes RH directement depuis Firebase
 */
export const useAlertsData = () => {
  const { hrAlerts, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les alertes avec des informations supplémentaires
  const formattedAlerts = useMemo(() => {
    if (!hrAlerts || hrAlerts.length === 0) {
      return [];
    }
    
    return hrAlerts.map(alert => {
      const employee = alert.employeeId && employees
        ? employees.find(emp => emp.id === alert.employeeId)
        : undefined;
        
      const assignedTo = alert.assignedToId && employees
        ? employees.find(emp => emp.id === alert.assignedToId)
        : undefined;
      
      return {
        id: alert.id,
        title: alert.title || 'Alerte sans titre',
        type: alert.type || 'Autre',
        severity: alert.severity || 'Moyenne',
        createdDate: formatDate(alert.createdDate),
        status: alert.status || 'Active',
        description: alert.description,
        employeeId: alert.employeeId,
        employeeName: employee 
          ? `${employee.firstName} ${employee.lastName}`
          : alert.employeeName || 'Non assigné',
        employeePhoto: employee?.photoURL || employee?.photo || alert.employeePhoto || '',
        dueDate: alert.dueDate ? formatDate(alert.dueDate) : undefined,
        resolvedDate: alert.resolvedDate ? formatDate(alert.resolvedDate) : undefined,
        assignedToId: alert.assignedToId,
        assignedToName: assignedTo
          ? `${assignedTo.firstName} ${assignedTo.lastName}`
          : alert.assignedToName || 'Non assigné',
      } as Alert;
    });
  }, [hrAlerts, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les alertes
  const alertsStats = useMemo(() => {
    const active = formattedAlerts.filter(alert => alert.status === 'Active').length;
    const pending = formattedAlerts.filter(alert => alert.status === 'En attente').length;
    const resolved = formattedAlerts.filter(alert => alert.status === 'Résolue').length;
    const total = formattedAlerts.length;
    
    // Compteurs par sévérité
    const high = formattedAlerts.filter(alert => alert.severity === 'Haute').length;
    const medium = formattedAlerts.filter(alert => alert.severity === 'Moyenne').length;
    const low = formattedAlerts.filter(alert => alert.severity === 'Basse').length;
    
    return { active, pending, resolved, total, high, medium, low };
  }, [formattedAlerts]);
  
  return {
    alerts: formattedAlerts,
    stats: alertsStats,
    isLoading,
    error
  };
};
