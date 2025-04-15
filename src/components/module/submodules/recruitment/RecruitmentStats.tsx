
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, Calendar, Briefcase } from 'lucide-react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

const RecruitmentStats = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();

  const stats = {
    total: recruitmentPosts.length,
    open: recruitmentPosts.filter(post => post.status === 'Open' || post.status === 'Ouvert').length,
    inProgress: recruitmentPosts.filter(post => post.status === 'In Progress' || post.status === 'En cours').length,
    closed: recruitmentPosts.filter(post => post.status === 'Closed' || post.status === 'Clôturé').length
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total des postes</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Building className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Postes ouverts</h3>
            <p className="text-2xl font-bold">{stats.open}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">En cours</h3>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Clôturés</h3>
            <p className="text-2xl font-bold">{stats.closed}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentStats;
