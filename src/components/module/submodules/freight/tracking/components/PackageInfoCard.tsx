
import React from 'react';
import { Package } from '@/types/freight';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Calendar, Info, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PackageStatusBadge from './PackageStatusBadge';

interface PackageInfoCardProps {
  packageData: Package;
}

const PackageInfoCard: React.FC<PackageInfoCardProps> = ({ packageData }) => {
  // Vérifier si le statut du colis indique une anomalie
  const hasIssue = () => {
    const problemStatuses: string[] = ['returned', 'lost', 'exception', 'delayed'];
    return problemStatuses.includes(packageData.status as string);
  };

  return (
    <Card className="bg-white border">
      <CardContent className="grid gap-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gray-500" />
            <span className="font-semibold">Transporteur:</span>
            <span>{packageData.carrierName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="font-semibold">Date d'expédition:</span>
            <span>{format(new Date(packageData.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-500" />
            <span className="font-semibold">Statut:</span>
            <PackageStatusBadge status={packageData.status} />
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="font-semibold">Livraison prévue:</span>
            <span>
              {packageData.createdAt ? format(new Date(new Date(packageData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr }) : 'Non disponible'}
            </span>
          </div>
        </div>
        
        {hasIssue() && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">
              Attention: Ce colis rencontre un problème. Veuillez contacter le service client pour plus d'informations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PackageInfoCard;
