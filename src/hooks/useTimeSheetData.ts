
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeReport } from '@/types/timesheet';

/**
 * Hook pour accéder aux données des feuilles de temps
 * Ce hook est un wrapper autour de useHrModuleData qui facilite
 * l'accès aux données spécifiques des feuilles de temps
 */
export const useTimeSheetData = () => {
  const {
    timeSheets,
    employees,
    isLoading,
    error
  } = useHrModuleData();

  // Traitement pour enrichir les feuilles de temps avec les informations des employés
  const enrichedTimeSheets = useMemo(() => {
    if (!timeSheets || !employees) return [];

    return timeSheets.map(sheet => {
      // Trouver l'employé correspondant
      const employee = employees.find(emp => emp.id === sheet.employeeId);
      
      // Calculer quand la feuille a été mise à jour pour la dernière fois
      const lastUpdateText = sheet.updatedAt 
        ? formatDistanceToNow(new Date(sheet.updatedAt), { addSuffix: true, locale: fr })
        : 'Date inconnue';
      
      return {
        ...sheet, // Conserver toutes les propriétés d'origine
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : sheet.employeeId || 'Inconnu',
        employeePhoto: employee?.photo || employee?.photoURL,
        lastUpdateText
      };
    }) as TimeReport[];
  }, [timeSheets, employees]);
  
  // Organiser les feuilles de temps par statut
  const timeSheetsByStatus = useMemo(() => {
    const result: Record<string, TimeReport[]> = {
      'En cours': [],
      'Soumis': [],
      'Validé': [],
      'Rejeté': []
    };
    
    if (enrichedTimeSheets && enrichedTimeSheets.length > 0) {
      enrichedTimeSheets.forEach(sheet => {
        if (sheet.status && result[sheet.status]) {
          result[sheet.status].push(sheet);
        } else {
          result['En cours'].push(sheet);
        }
      });
    }
    
    return result;
  }, [enrichedTimeSheets]);

  // Obtenir les statistiques des feuilles de temps
  const timeSheetStats = useMemo(() => {
    const totalTimeSheets = enrichedTimeSheets.length;
    const pendingApproval = enrichedTimeSheets.filter(sheet => sheet.status === 'Soumis').length;
    const approved = enrichedTimeSheets.filter(sheet => sheet.status === 'Validé').length;
    const rejected = enrichedTimeSheets.filter(sheet => sheet.status === 'Rejeté').length;
    
    return {
      totalTimeSheets,
      pendingApproval,
      approved,
      rejected,
      completionRate: totalTimeSheets > 0 ? Math.round((approved / totalTimeSheets) * 100) : 0
    };
  }, [enrichedTimeSheets]);

  return {
    timeSheets: enrichedTimeSheets,
    rawTimeSheets: timeSheets || [],
    timeSheetsByStatus,
    timeSheetStats,
    isLoading,
    error
  };
};
