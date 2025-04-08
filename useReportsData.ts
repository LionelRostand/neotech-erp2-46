
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
      return [];
    }
    
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
