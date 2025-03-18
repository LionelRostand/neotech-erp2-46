
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ReportCardProps {
  title: string;
  description: string;
  lastUpdated: string;
  icon: React.ReactNode;
  status: 'ready' | 'updating' | 'scheduled';
  category: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  lastUpdated,
  icon,
  status,
}) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ready':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'updating':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Mise à jour</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planifié</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium">{title}</h3>
          </div>
          {getStatusBadge(status)}
        </div>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <p className="text-xs text-gray-400">Dernière mise à jour: {lastUpdated}</p>
      </CardContent>
    </Card>
  );
};
