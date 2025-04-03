
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Recruitment {
  id: string;
  position: string;
  department?: string;
  status: 'Ouvert' | 'En cours' | 'Clôturé' | 'Abandonné';
  openDate: string;
  closeDate?: string;
  applicationCount?: number;
  hiringManagerId?: string;
  hiringManagerName?: string;
  priority?: 'Haute' | 'Moyenne' | 'Basse';
  description?: string;
}

/**
 * Hook pour accéder aux données de recrutement directement depuis Firebase
 */
export const useRecruitmentData = () => {
  const { recruitmentPosts, employees, departments, isLoading, error } = useHrModuleData();
  
  // Enrichir les postes de recrutement avec des informations supplémentaires
  const formattedRecruitmentPosts = useMemo(() => {
    if (!recruitmentPosts || recruitmentPosts.length === 0) {
      return [];
    }
    
    return recruitmentPosts.map(post => {
      const hiringManager = post.hiringManagerId && employees
        ? employees.find(emp => emp.id === post.hiringManagerId)
        : undefined;
        
      const dept = post.departmentId && departments
        ? departments.find(d => d.id === post.departmentId)
        : undefined;
      
      return {
        id: post.id,
        position: post.position || 'Non spécifié',
        department: dept?.name || post.department || 'Non spécifié',
        status: post.status || 'Ouvert',
        openDate: formatDate(post.openDate),
        closeDate: post.closeDate ? formatDate(post.closeDate) : undefined,
        applicationCount: post.applicationCount || 0,
        hiringManagerId: post.hiringManagerId,
        hiringManagerName: hiringManager 
          ? `${hiringManager.firstName} ${hiringManager.lastName}`
          : post.hiringManagerName || 'Non assigné',
        priority: post.priority || 'Moyenne',
        description: post.description,
      } as Recruitment;
    });
  }, [recruitmentPosts, employees, departments]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur le recrutement
  const recruitmentStats = useMemo(() => {
    const open = formattedRecruitmentPosts.filter(post => post.status === 'Ouvert').length;
    const inProgress = formattedRecruitmentPosts.filter(post => post.status === 'En cours').length;
    const closed = formattedRecruitmentPosts.filter(post => post.status === 'Clôturé').length;
    const abandoned = formattedRecruitmentPosts.filter(post => post.status === 'Abandonné').length;
    const total = formattedRecruitmentPosts.length;
    
    // Calculer le nombre total de candidatures
    const totalApplications = formattedRecruitmentPosts.reduce(
      (sum, post) => sum + (post.applicationCount || 0), 
      0
    );
    
    return { open, inProgress, closed, abandoned, total, totalApplications };
  }, [formattedRecruitmentPosts]);
  
  return {
    recruitmentPosts: formattedRecruitmentPosts,
    stats: recruitmentStats,
    isLoading,
    error
  };
};
