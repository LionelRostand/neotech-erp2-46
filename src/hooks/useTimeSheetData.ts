
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Hook pour accéder aux données des feuilles de temps
 */
export const useTimeSheetData = () => {
  const { timeSheets, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les feuilles de temps avec les noms des employés
  const formattedTimeSheets = useMemo(() => {
    if (!timeSheets || timeSheets.length === 0) return [] as TimeReport[];
    if (!employees || employees.length === 0) return timeSheets as TimeReport[];
    
    return timeSheets.map(timeSheet => {
      const employee = employees.find(emp => emp.id === timeSheet.employeeId);
      
      // S'assurer que toutes les propriétés nécessaires sont présentes
      return {
        ...timeSheet, // Garder toutes les propriétés existantes
        id: timeSheet.id || '',
        title: timeSheet.title || '',
        employeeId: timeSheet.employeeId || '',
        startDate: timeSheet.startDate || new Date().toISOString(),
        endDate: timeSheet.endDate || new Date().toISOString(),
        totalHours: timeSheet.totalHours || 0,
        status: (timeSheet.status as TimeReportStatus) || "En cours",
        lastUpdated: timeSheet.updatedAt || timeSheet.lastUpdated || timeSheet.createdAt || new Date().toISOString(),
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : (timeSheet.employeeName || 'Employé inconnu'),
        employeePhoto: employee?.photoURL || employee?.photo || '',
        lastUpdateText: formatDate(timeSheet.updatedAt || timeSheet.lastUpdated || timeSheet.createdAt || new Date().toISOString())
      } as TimeReport;
    }) as TimeReport[];
  }, [timeSheets, employees]);
  
  // Filtrer les feuilles de temps par statut
  const getTimesheetsByStatus = useMemo(() => {
    const pending = formattedTimeSheets.filter(ts => ts.status === "Soumis");
    const active = formattedTimeSheets.filter(ts => ts.status === "En cours");
    const validated = formattedTimeSheets.filter(ts => ts.status === "Validé");
    const rejected = formattedTimeSheets.filter(ts => ts.status === "Rejeté");
    
    return {
      pending,
      active,
      validated,
      rejected,
      all: formattedTimeSheets
    };
  }, [formattedTimeSheets]);
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  return {
    timeSheets: formattedTimeSheets,
    timesheetsByStatus: getTimesheetsByStatus,
    isLoading,
    error
  };
};
