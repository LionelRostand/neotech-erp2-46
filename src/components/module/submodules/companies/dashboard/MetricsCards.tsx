
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, FileText, Activity, TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    totalCompanies: number;
    totalDocuments: number;
    activeCompanies: number;
    growthRate: number;
  };
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Entreprises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold">{metrics.totalCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">Total des entreprises</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold">{metrics.totalDocuments}</div>
              <p className="text-xs text-gray-500 mt-1">Documents stockés</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Entreprises actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold">{metrics.activeCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">Actives ces 30 derniers jours</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Taux de croissance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold flex items-center">
                {metrics.growthRate}%
                <ArrowUpRight className="h-5 w-5 ml-1 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Par rapport au mois dernier</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
