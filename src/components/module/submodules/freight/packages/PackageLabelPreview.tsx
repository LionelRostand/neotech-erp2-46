
import React from 'react';
import { Package } from '@/types/freight';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import QRCode from './QRCode';

interface PackageLabelPreviewProps {
  packageData: Package;
}

const PackageLabelPreview: React.FC<PackageLabelPreviewProps> = ({ packageData }) => {
  if (!packageData.labelGenerated) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune étiquette générée pour ce colis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>
        <Button size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <div className="border rounded-md p-6 bg-white">
        <div className="max-w-[400px] mx-auto border border-dashed p-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">{packageData.carrierName || 'Transporteur'}</h3>
            <p className="text-sm text-gray-500">Étiquette d'expédition</p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full mb-6">
            <div>
              <p className="text-xs text-gray-500">Référence</p>
              <p className="font-medium">{packageData.reference}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Poids</p>
              <p className="font-medium">{packageData.weight} {packageData.weightUnit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dimensions</p>
              <p className="font-medium">
                {packageData.dimensions 
                  ? `${packageData.dimensions.length}×${packageData.dimensions.width}×${packageData.dimensions.height} ${packageData.dimensions.unit}`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-medium">{packageData.packageType}</p>
            </div>
          </div>

          <div className="mb-6 w-full">
            <p className="text-xs text-gray-500 mb-1">N° de suivi</p>
            <p className="font-bold text-lg">{packageData.trackingNumber}</p>
          </div>

          <div className="mb-6">
            <QRCode value={packageData.trackingNumber || packageData.reference} />
          </div>

          <div className="border-t border-dashed pt-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Contenu</p>
                <p className="text-sm">{packageData.contents || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valeur déclarée</p>
                <p className="text-sm">
                  {packageData.declaredValue 
                    ? `${packageData.declaredValue} ${packageData.currency || 'EUR'}`
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageLabelPreview;
