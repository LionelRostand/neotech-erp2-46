
import { useMemo, useState, useEffect } from 'react';
import { RecruitmentPost } from '@/types/recruitment';

// Sample mock data with corrected types
const MOCK_RECRUITMENT_POSTS: Partial<RecruitmentPost>[] = [
  {
    id: 'job-1',
    position: 'Développeur Full-Stack',
    department: 'IT',
    location: 'Paris',
    priority: 'Haute',
    status: 'En cours',
    description: 'Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe technique.',
    requirements: 'Expérience minimale de 3 ans, maîtrise de React, Node.js et MongoDB.',
    contractType: 'full-time',
    experienceLevel: 'intermediate',
    publishDate: '2023-03-15',
    createdAt: new Date('2023-03-10T10:00:00Z'),
    updatedAt: new Date('2023-03-10T10:00:00Z'),
    openDate: '15/03/2023',
    applicationDeadline: '15/05/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    applicationCount: 12,
    salary: {
      min: 45000,
      max: 55000,
      currency: 'EUR'
    },
  },
  {
    id: 'job-2',
    position: 'Chef de projet',
    department: 'IT',
    location: 'Paris',
    priority: 'Moyenne',
    status: 'Ouverte',
    description: 'Rôle de chef de projet pour nos grands comptes.',
    requirements: 'Expérience en gestion de projet IT, certification PMP appréciée.',
    contractType: 'full-time',
    experienceLevel: 'senior',
    publishDate: '2023-04-01',
    createdAt: new Date('2023-04-01T10:00:00Z'),
    updatedAt: new Date('2023-04-01T10:00:00Z'),
    openDate: '01/04/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    applicationCount: 5,
    salary: {
      min: 50000,
      max: 60000,
      currency: 'EUR'
    },
  },
  {
    id: 'job-3',
    position: 'Responsable RH',
    department: 'RH',
    location: 'Lyon',
    priority: 'Haute',
    status: 'Fermée',
    description: 'Gestion complète du département RH.',
    requirements: 'Minimum 5 ans d\'expérience en RH, connaissance du droit du travail français.',
    contractType: 'full-time',
    experienceLevel: 'senior',
    publishDate: '2023-02-15',
    createdAt: new Date('2023-02-15T10:00:00Z'),
    updatedAt: new Date('2023-02-15T10:00:00Z'),
    openDate: '15/02/2023',
    applicationDeadline: '15/04/2023',
    hiringManagerId: 'user-3',
    hiringManagerName: 'Pierre Martin',
    applicationCount: 18,
    salary: {
      min: 45000,
      max: 55000,
      currency: 'EUR'
    },
  },
  {
    id: 'job-4',
    position: 'Commercial B2B',
    department: 'Commercial',
    location: 'Toulouse',
    priority: 'Basse',
    status: 'Ouverte',
    description: 'Développement du portefeuille clients B2B dans le secteur Sud-Ouest.',
    requirements: 'Expérience commerciale B2B, connaissance du secteur IT appréciée.',
    contractType: 'full-time',
    experienceLevel: 'intermediate',
    publishDate: '2023-03-10',
    createdAt: new Date('2023-03-10T10:00:00Z'),
    updatedAt: new Date('2023-03-10T10:00:00Z'),
    openDate: '10/03/2023',
    hiringManagerId: 'user-4',
    hiringManagerName: 'Sophie Bernard',
    applicationCount: 3,
    salary: {
      min: 35000,
      max: 45000,
      currency: 'EUR'
    },
  },
  {
    id: 'job-5',
    position: 'Développeur Mobile',
    department: 'IT',
    location: 'Paris',
    priority: 'Haute',
    status: 'Ouverte',
    description: 'Développement d\'applications mobiles natives (iOS et Android).',
    requirements: 'Expérience en Swift et Kotlin, connaissance de React Native appréciée.',
    contractType: 'full-time',
    experienceLevel: 'intermediate',
    publishDate: '2023-04-05',
    createdAt: new Date('2023-04-05T10:00:00Z'),
    updatedAt: new Date('2023-04-05T10:00:00Z'),
    openDate: '05/04/2023',
    hiringManagerId: 'user-2',
    hiringManagerName: 'Marie Dubois',
    applicationCount: 7,
    salary: {
      min: 45000,
      max: 55000,
      currency: 'EUR'
    },
  },
  {
    id: 'job-6',
    position: 'Gestionnaire de paie',
    department: 'RH',
    location: 'Lyon',
    priority: 'Moyenne',
    status: 'En cours',
    description: 'Gestion complète de la paie et des déclarations sociales.',
    requirements: 'Minimum 2 ans d\'expérience en gestion de paie, maîtrise de SAGE Paie.',
    contractType: 'full-time',
    experienceLevel: 'intermediate',
    publishDate: '2023-03-22',
    createdAt: new Date('2023-03-22T10:00:00Z'),
    updatedAt: new Date('2023-03-22T10:00:00Z'),
    openDate: '22/03/2023',
    hiringManagerId: 'user-3',
    hiringManagerName: 'Pierre Martin',
    applicationCount: 9,
    salary: {
      min: 38000,
      max: 42000,
      currency: 'EUR'
    },
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
        // Cast to RecruitmentPost[] to ensure type safety
        setRecruitmentPosts(MOCK_RECRUITMENT_POSTS as RecruitmentPost[]);
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
    const open = recruitmentPosts.filter(post => post.status === 'Ouverte').length;
    const inProgress = recruitmentPosts.filter(post => post.status === 'En cours').length;
    const closed = recruitmentPosts.filter(post => post.status === 'Fermée').length;
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
