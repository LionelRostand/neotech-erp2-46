
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, PackageDocument } from '@/types/freight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Download, Printer, QrCode, LayoutGrid, Truck, LayoutList } from 'lucide-react';
import PackageLabelPreview from './PackageLabelPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PackageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Package;
}

const PackageDetailsDialog: React.FC<PackageDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  packageData 
}) => {
  const formatDocumentType = (type: string): string => {
    switch (type) {
      case 'invoice': return 'Facture';
      case 'delivery_note': return 'Bon de livraison';
      case 'customs': return 'Document douanier';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Détails du colis {packageData.reference}</DialogTitle>
          <DialogDescription>
            Créé le {format(new Date(packageData.createdAt), 'dd MMMM yyyy', { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">
              <LayoutList className="mr-2 h-4 w-4" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="label" disabled={!packageData.labelGenerated}>
              <QrCode className="mr-2 h-4 w-4" />
              Étiquette
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={packageData.documents.length === 0}>
              <FileText className="mr-2 h-4 w-4" />
              Documents ({packageData.documents.length})
            </TabsTrigger>
            <TabsTrigger value="carrier" disabled={!packageData.carrierId}>
              <Truck className="mr-2 h-4 w-4" />
              Transporteur
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{packageData.description || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contenu</h3>
                  <p className="mt-1">{packageData.contents || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type de colis</h3>
                  <p className="mt-1">{packageData.packageType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valeur déclarée</h3>
                  <p className="mt-1">
                    {packageData.declaredValue 
                      ? `${packageData.declaredValue} ${packageData.currency || 'EUR'}`
                      : 'Non spécifiée'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Poids</h3>
                  <p className="mt-1">{packageData.weight} {packageData.weightUnit}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                  <p className="mt-1">
                    {packageData.dimensions 
                      ? `${packageData.dimensions.length} × ${packageData.dimensions.width} × ${packageData.dimensions.height} ${packageData.dimensions.unit}`
                      : 'Non spécifiées'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expédition associée</h3>
                  <p className="mt-1">
                    {packageData.shipmentId 
                      ? `ID: ${packageData.shipmentId}`
                      : 'Non associé à une expédition'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className="mt-1">{packageData.status}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="label" className="mt-4">
            <PackageLabelPreview packageData={packageData} />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              {packageData.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-md">{doc.name}</CardTitle>
                        <CardDescription>
                          {formatDocumentType(doc.type)} • Créé le {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: fr })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="carrier" className="mt-4">
            {packageData.carrierId && packageData.carrierName ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>{packageData.carrierName}</CardTitle>
                    {packageData.trackingNumber && (
                      <CardDescription>
                        N° de suivi: {packageData.trackingNumber}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {packageData.trackingNumber && (
                    <CardContent className="p-4 pt-0">
                      <Button variant="outline">
                        Suivre ce colis
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun transporteur associé à ce colis
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsDialog;
