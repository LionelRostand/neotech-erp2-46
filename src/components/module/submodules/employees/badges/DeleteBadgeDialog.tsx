
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
import { BadgeIcon, AlertTriangle } from 'lucide-react';
import { BadgeData } from './BadgeTypes';

interface DeleteBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting?: boolean;
}

const DeleteBadgeDialog: React.FC<DeleteBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
  onConfirmDelete,
  isDeleting = false
}) => {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Supprimer le badge
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce badge ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
            <BadgeIcon className="h-8 w-8 text-gray-500" />
            <div>
              <p className="font-medium">{badge.id}</p>
              <p className="text-sm text-muted-foreground">Appartient à: {badge.employeeName}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBadgeDialog;
