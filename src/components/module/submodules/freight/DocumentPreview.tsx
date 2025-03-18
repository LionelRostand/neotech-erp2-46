
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShipmentLine } from '@/types/freight';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewProps {
  type: 'invoice' | 'delivery';
  isOpen: boolean;
  onClose: () => void;
  shipmentLines: ShipmentLine[];
  totalPrice: number;
  trackingCode: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  type,
  isOpen,
  onClose,
  shipmentLines,
  totalPrice,
  trackingCode
}) => {
  const { toast } = useToast();
  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  const documentNumber = `${type === 'invoice' ? 'FACT' : 'BL'}-${Date.now().toString().slice(-8)}`;
  
  const handlePrint = () => {
    toast({
      title: "Impression lancée",
      description: `Le ${type === 'invoice' ? 'facture' : 'bon de livraison'} est envoyé à l'imprimante.`
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handleDownload = () => {
    toast({
      title: "Téléchargement",
      description: `Le ${type === 'invoice' ? 'facture' : 'bon de livraison'} a été téléchargé.`
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] min-h-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'invoice' ? 'Aperçu de la facture' : 'Aperçu du bon de livraison'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 border p-6 rounded-md bg-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">NeotechLogistic</h2>
              <p className="text-sm">123 Avenue de la Logistique</p>
              <p className="text-sm">75001 Paris, France</p>
              <p className="text-sm">contact@neotechlogistic.com</p>
              <p className="text-sm">+33 1 23 45 67 89</p>
            </div>
            
            <div className="text-right">
              <h1 className="text-xl font-bold mb-2">
                {type === 'invoice' ? 'FACTURE' : 'BON DE LIVRAISON'}
              </h1>
              <p className="text-sm"><strong>N° :</strong> {documentNumber}</p>
              <p className="text-sm"><strong>Date :</strong> {today}</p>
              <p className="text-sm"><strong>Réf. expédition :</strong> {trackingCode}</p>
            </div>
          </div>
          
          <div className="flex justify-between mb-8">
            <div className="border p-3 rounded-md w-1/3">
              <h3 className="font-medium mb-1">Expéditeur</h3>
              <p className="text-sm">NeotechLogistic</p>
              <p className="text-sm">123 Avenue de la Logistique</p>
              <p className="text-sm">75001 Paris, France</p>
            </div>
            
            <div className="border p-3 rounded-md w-1/3">
              <h3 className="font-medium mb-1">Destinataire</h3>
              <p className="text-sm">Client ABC</p>
              <p className="text-sm">456 Rue du Commerce</p>
              <p className="text-sm">69002 Lyon, France</p>
            </div>
          </div>
          
          <div className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qté</TableHead>
                  <TableHead className="text-right">Poids (kg)</TableHead>
                  {type === 'invoice' && (
                    <>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipmentLines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>{line.productName || `Article ${index + 1}`}</TableCell>
                    <TableCell className="text-right">{line.quantity}</TableCell>
                    <TableCell className="text-right">{line.weight.toFixed(2)}</TableCell>
                    {type === 'invoice' && (
                      <>
                        <TableCell className="text-right">
                          {(totalPrice / shipmentLines.reduce((sum, l) => sum + l.quantity, 0)).toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right">
                          {((totalPrice / shipmentLines.reduce((sum, l) => sum + l.quantity, 0)) * line.quantity).toFixed(2)} €
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {type === 'invoice' && (
            <div className="flex justify-end mb-6">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total :</span>
                  <span>{(totalPrice * 0.8).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%) :</span>
                  <span>{(totalPrice * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total :</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-2">Informations de suivi</h3>
            <p className="text-sm mb-1">
              <strong>Code de suivi :</strong> {trackingCode}
            </p>
            <p className="text-sm">
              Vous pouvez suivre votre expédition en temps réel en utilisant ce code sur notre portail client ou en scannant le QR code ci-dessous.
            </p>
            
            <div className="flex justify-center my-4">
              {/* Simple representation of a QR code */}
              <div className="border-2 border-black w-32 h-32 flex items-center justify-center p-2">
                <div className="text-xs text-center">
                  QR Code pour {trackingCode}
                </div>
              </div>
            </div>
          </div>
          
          {type === 'delivery' && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">Signature</h3>
              <div className="flex justify-between">
                <div className="border p-10 w-5/12 text-center text-sm text-gray-400">
                  Signature de l'expéditeur
                </div>
                <div className="border p-10 w-5/12 text-center text-sm text-gray-400">
                  Signature du destinataire
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
