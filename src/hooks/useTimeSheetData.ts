
import { useMemo, useState, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAllTimeSheets } from '@/components/module/submodules/timesheet/services/timesheetService';

/**
 * Hook pour accéder aux données des feuilles de temps
 */
export const useTimeSheetData = () => {
  const { timeSheets: hrTimeSheets, employees, isLoading: isHrLoading, error: hrError } = useHrModuleData();
  const [localTimeSheets, setLocalTimeSheets] = useState<TimeReport[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Fonction pour rafraîchir les données directement depuis Firestore
  const refetch = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const freshTimeSheets = await getAllTimeSheets();
      if (freshTimeSheets && freshTimeSheets.length > 0) {
        setLocalTimeSheets(freshTimeSheets);
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des feuilles de temps:', error);
      setLocalError(error instanceof Error ? error : new Error('Erreur inconnue'));
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  
  // Fusionner les données de HR et les données localement chargées
  const mergedTimeSheets = useMemo(() => {
    if (localTimeSheets.length > 0) {
      return localTimeSheets;
    }
    return hrTimeSheets || [];
  }, [hrTimeSheets, localTimeSheets]);
  
  // Enrichir les feuilles de temps avec les noms des employés
  const formattedTimeSheets = useMemo(() => {
    if (!mergedTimeSheets || mergedTimeSheets.length === 0) return [] as TimeReport[];
    if (!employees || employees.length === 0) return mergedTimeSheets as TimeReport[];
    
    return mergedTimeSheets.map(timeSheet => {
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
        employeePhoto: employee?.photoURL || employee?.photo || timeSheet.employeePhoto || '',
        lastUpdateText: formatDate(timeSheet.updatedAt || timeSheet.lastUpdated || timeSheet.createdAt || new Date().toISOString())
      } as TimeReport;
    }) as TimeReport[];
  }, [mergedTimeSheets, employees]);
  
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
  
  // Déterminer l'état de chargement global
  const isLoading = isHrLoading || isLocalLoading || isRefreshing;
  
  // Déterminer s'il y a une erreur
  const error = localError || hrError;
  
  return {
    timeSheets: formattedTimeSheets,
    timesheetsByStatus: getTimesheetsByStatus,
    isLoading,
    error,
    refetch
  };
};
