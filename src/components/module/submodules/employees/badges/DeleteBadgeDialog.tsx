
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import { BadgeData } from './BadgeTypes';

interface DeleteBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteBadgeDialog: React.FC<DeleteBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
  onConfirmDelete,
  isDeleting,
}) => {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer le badge</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce badge ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p><span className="font-medium">Badge ID:</span> {badge.id}</p>
            <p><span className="font-medium">Employé:</span> {badge.employeeName}</p>
            <p><span className="font-medium">Date d'émission:</span> {badge.date}</p>
            <p><span className="font-medium">Statut:</span> {badge.statusText}</p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            La suppression de ce badge empêchera l'employé d'accéder aux installations avec ce badge.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete} 
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBadgeDialog;
