
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Report {
  id: string;
  title: string;
  type: string;
  createdDate: string;
  createdBy?: string;
  creatorName?: string;
  status: 'Généré' | 'En traitement' | 'Erreur';
  downloadUrl?: string;
  period?: string;
  format?: 'PDF' | 'Excel' | 'CSV';
  description?: string;
  size?: string;
  views?: number;
  lastViewed?: string;
}

/**
 * Hook pour accéder aux données des rapports directement depuis Firebase
 */
export const useReportsData = () => {
  const { hrReports, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les rapports avec des informations supplémentaires
  const formattedReports = useMemo(() => {
    if (!hrReports || hrReports.length === 0) {
      // Fournir quelques données fictives pour démonstration
      // Ces données devraient venir de Firebase à terme
      return [
        {
          id: 'rep-1',
          title: 'Rapport des absences',
          type: 'Absences',
          createdDate: '2023-03-15',
          createdBy: 'emp-001',
          creatorName: 'Jean Dupont',
          status: 'Généré',
          downloadUrl: '/reports/absences-2023-03.pdf',
          period: 'Mars 2023',
          format: 'PDF',
          description: 'Rapport détaillé des absences pour le mois de mars 2023',
          size: '1.2 MB',
          views: 5,
          lastViewed: '2023-03-20',
        },
        {
          id: 'rep-2',
          title: 'Statistiques des congés',
          type: 'Congés',
          createdDate: '2023-02-28',
          createdBy: 'emp-002',
          creatorName: 'Marie Lambert',
          status: 'Généré',
          downloadUrl: '/reports/leaves-q1-2023.xlsx',
          period: 'T1 2023',
          format: 'Excel',
          description: 'Statistiques des congés pour le premier trimestre 2023',
          size: '3.5 MB',
          views: 12,
          lastViewed: '2023-03-18',
        },
        {
          id: 'rep-3',
          title: 'Analyse des salaires',
          type: 'Salaires',
          createdDate: '2023-01-31',
          createdBy: 'emp-003',
          creatorName: 'Pierre Martin',
          status: 'Généré',
          downloadUrl: '/reports/salaries-jan-2023.csv',
          period: 'Janvier 2023',
          format: 'CSV',
          description: 'Analyse des salaires pour le mois de janvier 2023',
          size: '2.1 MB',
          views: 8,
          lastViewed: '2023-02-10',
        }
      ] as Report[];
    }
    
    // Quand nous aurons des données réelles, nous les traiterons ici
    return hrReports.map(report => {
      const creator = report.createdBy && employees
        ? employees.find(emp => emp.id === report.createdBy)
        : undefined;
      
      return {
        id: report.id,
        title: report.title || 'Rapport sans titre',
        type: report.type || 'Non spécifié',
        createdDate: formatDate(report.createdDate),
        createdBy: report.createdBy,
        creatorName: creator 
          ? `${creator.firstName} ${creator.lastName}`
          : report.creatorName || 'Utilisateur système',
        status: report.status || 'Généré',
        downloadUrl: report.downloadUrl,
        period: report.period,
        format: report.format || 'PDF',
        description: report.description,
        size: report.size,
        views: report.views || 0,
        lastViewed: report.lastViewed ? formatDate(report.lastViewed) : undefined,
      } as Report;
    });
  }, [hrReports, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les rapports
  const reportsStats = useMemo(() => {
    const generated = formattedReports.filter(report => report.status === 'Généré').length;
    const processing = formattedReports.filter(report => report.status === 'En traitement').length;
    const errors = formattedReports.filter(report => report.status === 'Erreur').length;
    const total = formattedReports.length;
    
    // Calculer le nombre total de vues
    const totalViews = formattedReports.reduce(
      (sum, report) => sum + (report.views || 0), 
      0
    );
    
    return { generated, processing, errors, total, totalViews };
  }, [formattedReports]);
  
  return {
    reports: formattedReports,
    stats: reportsStats,
    isLoading,
    error
  };
};
