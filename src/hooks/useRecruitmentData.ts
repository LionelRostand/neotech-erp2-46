
import { useMemo, useState, useEffect } from 'react';
import { RecruitmentPost } from '@/types/recruitment';

const MOCK_RECRUITMENT_POSTS: RecruitmentPost[] = [
  {
    id: 'job-1',
    position: 'Développeur Full-Stack',
    department: 'IT',
    openDate: '15/03/2023',
    applicationDeadline: '15/05/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    status: 'En cours',
    priority: 'Haute',
    location: 'Paris',
    contractType: 'CDI',
    salary: '45-55K€',
    description: 'Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe technique.',
    requirements: 'Expérience minimale de 3 ans, maîtrise de React, Node.js et MongoDB.',
    applicationCount: 12,
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2023-03-10T10:00:00Z'
  },
  {
    id: 'job-2',
    position: 'Chef de projet',
    department: 'IT',
    openDate: '01/04/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    status: 'Ouvert',
    priority: 'Moyenne',
    location: 'Paris',
    contractType: 'CDI',
    salary: '50-60K€',
    description: 'Rôle de chef de projet pour nos grands comptes.',
    requirements: 'Expérience en gestion de projet IT, certification PMP appréciée.',
    applicationCount: 5,
    created_at: '2023-04-01T10:00:00Z',
    updated_at: '2023-04-01T10:00:00Z'
  },
  {
    id: 'job-3',
    position: 'Responsable RH',
    department: 'RH',
    openDate: '15/02/2023',
    applicationDeadline: '15/04/2023',
    hiringManagerId: 'user-3',
    hiringManagerName: 'Pierre Martin',
    status: 'Clôturé',
    priority: 'Haute',
    location: 'Lyon',
    contractType: 'CDI',
    salary: '45-55K€',
    description: 'Gestion complète du département RH.',
    requirements: 'Minimum 5 ans d\'expérience en RH, connaissance du droit du travail français.',
    applicationCount: 18,
    created_at: '2023-02-15T10:00:00Z',
    updated_at: '2023-02-15T10:00:00Z'
  },
  {
    id: 'job-4',
    position: 'Commercial B2B',
    department: 'Commercial',
    openDate: '10/03/2023',
    hiringManagerId: 'user-4',
    hiringManagerName: 'Sophie Bernard',
    status: 'Ouvert',
    priority: 'Basse',
    location: 'Toulouse',
    contractType: 'CDI',
    salary: '35-45K€ + commission',
    description: 'Développement du portefeuille clients B2B dans le secteur Sud-Ouest.',
    requirements: 'Expérience commerciale B2B, connaissance du secteur IT appréciée.',
    applicationCount: 3,
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2023-03-10T10:00:00Z'
  },
  {
    id: 'job-5',
    position: 'Développeur Mobile',
    department: 'IT',
    openDate: '05/04/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    status: 'Ouvert',
    priority: 'Haute',
    location: 'Paris',
    contractType: 'CDI',
    salary: '45-55K€',
    description: 'Développement d\'applications mobiles natives (iOS et Android).',
    requirements: 'Expérience en Swift et Kotlin, connaissance de React Native appréciée.',
    applicationCount: 7,
    created_at: '2023-04-05T10:00:00Z',
    updated_at: '2023-04-05T10:00:00Z'
  },
  {
    id: 'job-6',
    position: 'Gestionnaire de paie',
    department: 'RH',
    openDate: '22/03/2023',
    hiringManagerId: 'user-3',
    hiringManagerName: 'Pierre Martin',
    status: 'En cours',
    priority: 'Moyenne',
    location: 'Lyon',
    contractType: 'CDI',
    salary: '38-42K€',
    description: 'Gestion complète de la paie et des déclarations sociales.',
    requirements: 'Minimum 2 ans d\'expérience en gestion de paie, maîtrise de SAGE Paie.',
    applicationCount: 9,
    created_at: '2023-03-22T10:00:00Z',
    updated_at: '2023-03-22T10:00:00Z'
  }
];

export const useRecruitmentData = (refreshTrigger?: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setRecruitmentPosts(MOCK_RECRUITMENT_POSTS);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes
  
  const stats = useMemo(() => {
    // Update these comparisons to match the French status values
    const open = recruitmentPosts.filter(post => post.status === 'Ouvert').length;
    const inProgress = recruitmentPosts.filter(post => post.status === 'En cours').length;
    const closed = recruitmentPosts.filter(post => post.status === 'Clôturé').length;
    const totalApplications = recruitmentPosts.reduce((acc, curr) => acc + (curr.applicationCount || 0), 0);
    
    return { open, inProgress, closed, totalApplications };
  }, [recruitmentPosts]);
  
  return {
    recruitmentPosts,
    stats,
    isLoading,
    error
  };
};
