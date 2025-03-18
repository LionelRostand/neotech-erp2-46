
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart,
  Tooltip,
  Legend
} from 'recharts';
import { Employee } from '@/types/employee';
import { ReportFilters } from './reports/ReportFilters';
import { ReportCategoryTabs } from './reports/ReportCategoryTabs';
import { getMockReports } from './reports/reportsData';

const EmployeesReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Get mock reports data
  const reports = getMockReports();

  return (
    <div className="space-y-6">
      <ReportFilters 
        selectedPeriod={selectedPeriod} 
        setSelectedPeriod={setSelectedPeriod} 
      />

      <Card>
        <CardContent className="p-6">
          <ReportCategoryTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            reports={reports} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesReports;
