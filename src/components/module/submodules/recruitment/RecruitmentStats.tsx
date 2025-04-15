
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Calendar, ChevronUp, ChevronDown, Clock, CheckCircle } from 'lucide-react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

const RecruitmentStats = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  
  // Count stats based on the available data
  const openPositions = recruitmentPosts.filter(post => post.status === 'Open').length;
  const inProgressPositions = recruitmentPosts.filter(post => post.status === 'In Progress').length;
  const closedPositions = recruitmentPosts.filter(post => post.status === 'Closed').length;
  
  // Calculate total applications
  const applicationsThisMonth = recruitmentPosts.reduce((sum, post) => 
    sum + (post.applicationCount || 0), 0);
  
  // Calculate scheduled interviews
  const interviewsScheduled = recruitmentPosts.reduce((sum, post) => 
    sum + (post.interviews_scheduled || 0), 0);
  
  // Mock application change percentage for demo
  const applicationsChange = 15;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Building className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Postes ouverts</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{openPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">En cours</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{inProgressPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <CheckCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Clôturés</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{closedPositions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
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
                <p className="text-2xl font-bold">{applicationsThisMonth}</p>
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

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Entretiens programmés</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{interviewsScheduled}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Candidatures totales</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold">{applicationsThisMonth + (closedPositions * 12)}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentStats;
