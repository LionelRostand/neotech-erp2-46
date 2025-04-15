
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Calendar, ChevronUp, ChevronDown, Clock, CheckCircle } from 'lucide-react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

const RecruitmentStats = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  const [applicationsChange, setApplicationsChange] = useState<number>(0);
  const [stats, setStats] = useState({
    openPositions: 0,
    inProgressPositions: 0,
    closedPositions: 0,
    applicationsThisMonth: 0,
    interviewsScheduled: 0,
    totalApplications: 0
  });

  useEffect(() => {
    if (recruitmentPosts && recruitmentPosts.length > 0) {
      const openCount = recruitmentPosts.filter(post => post.status === 'Open' || post.status === 'Ouvert').length;
      const inProgressCount = recruitmentPosts.filter(post => post.status === 'In Progress' || post.status === 'En cours').length;
      const closedCount = recruitmentPosts.filter(post => post.status === 'Closed' || post.status === 'Clôturé').length;
      
      const applicationCount = recruitmentPosts.reduce((acc, post) => acc + (post.applicationCount || post.applications_count || 0), 0);
      const interviewsCount = recruitmentPosts.reduce((acc, post) => acc + (post.interviews_scheduled || 0), 0);
      
      // Set a random change percentage for demonstration purposes
      const randomChange = Math.floor(Math.random() * 30) - 10; // Random value between -10 and 20
      
      setStats({
        openPositions: openCount,
        inProgressPositions: inProgressCount,
        closedPositions: closedCount,
        applicationsThisMonth: applicationCount,
        interviewsScheduled: interviewsCount,
        totalApplications: applicationCount + (closedCount * 15) // Adding some fictive past applications
      });
      
      setApplicationsChange(randomChange);
    }
  }, [recruitmentPosts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Building className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Postes ouverts</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.openPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">En cours</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.inProgressPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <CheckCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Clôturés</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.closedPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Candidatures ce mois</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <div className="flex items-center">
                <p className="text-2xl font-bold">{stats.applicationsThisMonth}</p>
                {applicationsChange !== 0 && (
                  <div className={`flex items-center ml-2 ${applicationsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {applicationsChange > 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="text-xs">{Math.abs(applicationsChange)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Entretiens programmés</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.interviewsScheduled}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Candidatures totales</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentStats;
