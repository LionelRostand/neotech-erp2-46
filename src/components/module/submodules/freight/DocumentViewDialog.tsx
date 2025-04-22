
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
import { Download, Printer, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
  onDownload: () => void;
  onPrint: () => void;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onPrint
}) => {
  const { toast } = useToast();
  
  const getDocumentTypeIcon = () => {
    switch(document.type) {
      case 'invoice':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'delivery_note':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'bol':
        return <FileText className="h-6 w-6 text-amber-500" />;
      case 'customs':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'contract':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'certificate':
        return <FileText className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'invoice': return 'Facture';
      case 'delivery_note': return 'Bon de livraison';
      case 'bol': return 'Connaissement';
      case 'customs': return 'Document douanier';
      case 'contract': return 'Contrat';
      case 'certificate': return 'Certificat';
      default: return type;
    }
  };

  // Format the date safely, checking if it's valid first
  const formatDocumentDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const dateObj = new Date(dateString);
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }
      return format(dateObj, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  console.log('Viewing document:', document);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getDocumentTypeIcon()}
            <DialogTitle>{document.name}</DialogTitle>
          </div>
          <DialogDescription>
            {getDocumentTypeLabel(document.type)} • Créé le {formatDocumentDate(document.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-6 min-h-[300px] bg-slate-50">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{document.name}</h3>
              <p className="text-gray-500 mb-4">
                {document.format ? document.format.toUpperCase() : 'PDF'} • {document.size || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 max-w-md">
                Aperçu du document. Pour une meilleure visualisation, téléchargez ou imprimez le document.
              </p>
              
              <div className="flex justify-center gap-3 mt-6">
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Expédition associée</h3>
            <p className="mt-1">{document.shipment || document.reference || 'Non spécifié'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Créateur</h3>
            <p className="mt-1">{document.creator || 'Système'}</p>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
