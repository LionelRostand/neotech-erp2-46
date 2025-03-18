
import React from 'react';
import { Package } from '@/types/freight';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface PackageHeaderProps {
  packageData: Package;
  onBack: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ packageData, onBack }) => {
  return (
    <>
      <Button variant="ghost" onClick={onBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Card className="bg-white border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{packageData.reference}</CardTitle>
          <CardDescription className="text-gray-500">
            Détails du suivi pour le colis #{packageData.id}
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default PackageHeader;
