
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    name: string;
    type: string;
    url: string;
    reference?: string;
    createdAt: string;
  } | null;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  if (!document) return null;

  const handleDownload = () => {
    if (!document.url) return;
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = document.url;
    a.download = document.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!document.url) return;
    
    // Open a new window with just the PDF, which can be printed
    const printWindow = window.open(document.url, '_blank');
    
    if (printWindow) {
      // Wait for the PDF to load before printing
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Format date for display
  const formattedDate = document.createdAt 
    ? new Date(document.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      })
    : '';
  
  // Determine what type of document for display
  const documentTypeLabel = document.type === 'invoice' 
    ? 'Facture' 
    : document.type === 'delivery_note' 
      ? 'Bon de livraison' 
      : 'Document';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {document.name}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {documentTypeLabel} • Créé le {formattedDate}
          </div>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 border rounded-md p-8 flex items-center justify-center min-h-[400px]">
            {document.url ? (
              <iframe 
                src={document.url} 
                className="w-full h-[400px]" 
                title={document.name}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                Aperçu du document. Pour une meilleure visualisation, téléchargez ou
                imprimez le document.
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {document.reference && (
                <div className="text-sm text-muted-foreground">
                  Expédition associée: {document.reference}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
