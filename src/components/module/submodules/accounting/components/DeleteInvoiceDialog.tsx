
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { useToast } from '@/hooks/use-toast';

interface DeleteInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  onSuccess?: () => void;
}

const DeleteInvoiceDialog: React.FC<DeleteInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  onSuccess
}) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteDocument(COLLECTIONS.ACCOUNTING.INVOICES, invoiceId);
      
      toast({
        title: "Facture supprimée",
        description: `La facture ${invoiceNumber} a été supprimée avec succès.`
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer la facture
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la facture <strong>{invoiceNumber}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceDialog;
