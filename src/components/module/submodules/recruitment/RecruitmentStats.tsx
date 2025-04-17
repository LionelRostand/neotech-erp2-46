
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, CheckCircle, Calendar } from 'lucide-react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

const RecruitmentStats: React.FC = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  
  const stats = useMemo(() => {
    if (!recruitmentPosts || recruitmentPosts.length === 0) {
      return {
        openPositions: 0,
        ongoingRecruitments: 0,
        closedPositions: 0,
        totalApplications: 0,
        scheduledInterviews: 0
      };
    }
    
    const openPositions = recruitmentPosts.filter(post => post.status === 'Ouverte').length;
    const ongoingRecruitments = recruitmentPosts.filter(post => 
      post.status === 'En cours' || post.status === 'Entretiens' || post.status === 'Offre'
    ).length;
    const closedPositions = recruitmentPosts.filter(post => post.status === 'Fermée').length;
    
    // Calculate total applications
    const totalApplications = recruitmentPosts.reduce((total, post) => {
      if (post.candidates && post.candidates.length) {
        return total + post.candidates.length;
      }
      // Try using applicationCount if available
      if (post.applicationCount !== undefined) {
        return total + post.applicationCount;
      }
      // Try using applications_count if available
      if (post.applications_count !== undefined) {
        return total + post.applications_count;
      }
      return total;
    }, 0);
    
    // Calculate scheduled interviews
    const scheduledInterviews = recruitmentPosts.reduce((total, post) => {
      if (post.interviews_scheduled !== undefined) {
        return total + post.interviews_scheduled;
      }
      return total;
    }, 0);
    
    return {
      openPositions,
      ongoingRecruitments,
      closedPositions,
      totalApplications,
      scheduledInterviews
    };
  }, [recruitmentPosts]);
  
  if (isLoading) {
    return <div className="h-32 flex items-center justify-center">Chargement des statistiques...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Postes ouverts"
        value={stats.openPositions}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        description="Offres publiées"
        bgColor="bg-blue-50"
        textColor="text-blue-800"
      />
      
      <StatsCard
        title="En cours"
        value={stats.ongoingRecruitments}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        description="Processus actifs"
        bgColor="bg-amber-50"
        textColor="text-amber-800"
      />
      
      <StatsCard
        title="Postes pourvus"
        value={stats.closedPositions}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        description="Recrutements terminés"
        bgColor="bg-green-50"
        textColor="text-green-800"
      />
      
      <StatsCard
        title="Candidatures"
        value={stats.totalApplications}
        icon={<Users className="h-5 w-5 text-purple-500" />}
        description="Reçues au total"
        bgColor="bg-purple-50"
        textColor="text-purple-800"
      />
      
      <StatsCard
        title="Entretiens"
        value={stats.scheduledInterviews}
        icon={<Calendar className="h-5 w-5 text-indigo-500" />}
        description="Programmés"
        bgColor="bg-indigo-50"
        textColor="text-indigo-800"
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  bgColor,
  textColor
}) => {
  return (
    <Card className={`p-6 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="rounded-full p-2 bg-white">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default RecruitmentStats;
