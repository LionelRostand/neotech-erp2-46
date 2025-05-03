
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LeaveRequest, deleteLeaveRequest } from './services/leaveService';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeleteLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: LeaveRequest;
  onDeleteSuccess: () => void;
}

const DeleteLeaveDialog: React.FC<DeleteLeaveDialogProps> = ({ open, onOpenChange, leave, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteLeaveRequest(leave.id);
      toast.success("Demande de congé supprimée avec succès");
      onDeleteSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la demande de congé:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer la demande de congé</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette demande de congé ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Détails de la demande :</h4>
            <p>Type: {leave.type}</p>
            <p>Période: {formatDate(leave.startDate)} - {formatDate(leave.endDate)}</p>
            <p>Durée: {leave.durationDays || '-'} jour(s)</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLeaveDialog;
