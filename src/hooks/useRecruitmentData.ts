
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
  // Pour l'instant, nous utilisons le hook centralisé, mais dans le futur
  // une collection spécifique pourrait être ajoutée pour le recrutement
  const { recruitmentPosts, employees, departments, isLoading, error } = useHrModuleData();
  
  // Enrichir les postes de recrutement avec des informations supplémentaires
  const formattedRecruitmentPosts = useMemo(() => {
    if (!recruitmentPosts || recruitmentPosts.length === 0) {
      // Fournir quelques données fictives pour démonstration
      // Ces données devraient venir de Firebase à terme
      return [
        {
          id: 'rec-1',
          position: 'Développeur Frontend',
          department: 'Informatique',
          status: 'Ouvert',
          openDate: '2023-03-15',
          applicationCount: 12,
          hiringManagerId: 'emp-001',
          hiringManagerName: 'Jean Dupont',
          priority: 'Haute',
          description: 'Nous recherchons un développeur Frontend expérimenté maîtrisant React.'
        },
        {
          id: 'rec-2',
          position: 'Chef de projet',
          department: 'Marketing',
          status: 'En cours',
          openDate: '2023-02-10',
          applicationCount: 8,
          hiringManagerId: 'emp-002',
          hiringManagerName: 'Marie Lambert',
          priority: 'Moyenne',
          description: 'Chef de projet marketing digital avec expérience en gestion d\'équipe.'
        },
        {
          id: 'rec-3',
          position: 'Comptable',
          department: 'Finance',
          status: 'Clôturé',
          openDate: '2023-01-05',
          closeDate: '2023-02-28',
          applicationCount: 15,
          hiringManagerId: 'emp-003',
          hiringManagerName: 'Pierre Martin',
          priority: 'Basse',
          description: 'Poste pourvu, candidat sélectionné.'
        }
      ] as Recruitment[];
    }
    
    // Quand nous aurons des données réelles, nous les traiterons ici
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
