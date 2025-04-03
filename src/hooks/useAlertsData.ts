
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
      // Fournir quelques données fictives pour démonstration
      // Ces données devraient venir de Firebase à terme
      return [
        {
          id: 'alert-1',
          title: 'Contrat à renouveler',
          type: 'Contrat',
          severity: 'Haute',
          createdDate: '2023-03-10',
          status: 'Active',
          description: 'Le contrat de Jean Dupont expire dans 15 jours',
          employeeId: 'emp-001',
          employeeName: 'Jean Dupont',
          employeePhoto: '/avatars/jean.jpg',
          dueDate: '2023-03-25',
          assignedToId: 'emp-004',
          assignedToName: 'Sophie Lefèvre',
        },
        {
          id: 'alert-2',
          title: 'Document manquant',
          type: 'Document',
          severity: 'Moyenne',
          createdDate: '2023-03-08',
          status: 'En attente',
          description: 'La carte vitale de Marie Lambert n\'a pas été fournie',
          employeeId: 'emp-002',
          employeeName: 'Marie Lambert',
          employeePhoto: '/avatars/marie.jpg',
          dueDate: '2023-03-20',
          assignedToId: 'emp-002',
          assignedToName: 'Marie Lambert',
        },
        {
          id: 'alert-3',
          title: 'Trop d\'absences',
          type: 'Absence',
          severity: 'Moyenne',
          createdDate: '2023-02-25',
          status: 'Résolue',
          description: 'Pierre Martin a dépassé son quota d\'absences pour le mois',
          employeeId: 'emp-003',
          employeeName: 'Pierre Martin',
          employeePhoto: '/avatars/pierre.jpg',
          resolvedDate: '2023-03-05',
          assignedToId: 'emp-005',
          assignedToName: 'Thomas Dubois',
        }
      ] as Alert[];
    }
    
    // Quand nous aurons des données réelles, nous les traiterons ici
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
