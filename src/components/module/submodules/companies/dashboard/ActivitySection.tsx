
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import CompanyActivityChart from '../CompanyActivityChart';

const ActivitySection = () => {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">Activité des entreprises</CardTitle>
          <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
        </div>
        <div className="bg-gray-100 p-2 rounded-md">
          <BarChart3 className="h-5 w-5 text-gray-700" />
        </div>
      </CardHeader>
      <CardContent>
        <CompanyActivityChart />
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
