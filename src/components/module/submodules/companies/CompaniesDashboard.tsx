
import React from 'react';
import DashboardHeader from './dashboard/DashboardHeader';
import MetricsCards from './dashboard/MetricsCards';
import ActivitySection from './dashboard/ActivitySection';
import RecentItemsSection from './dashboard/RecentItemsSection';
import DashboardSkeleton from './dashboard/DashboardSkeleton';
import { useDashboardData } from './dashboard/useDashboardData';

const CompaniesDashboard: React.FC = () => {
  const { metrics, loading } = useDashboardData();
  
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <MetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivitySection />
        <RecentItemsSection />
      </div>
    </div>
  );
};

export default CompaniesDashboard;
