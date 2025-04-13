
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
  isDeleting
}) => {
  if (!badge) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le badge</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le badge de {badge.employeeName} ?
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p><strong>ID :</strong> {badge.id}</p>
              <p><strong>Type d'accès :</strong> {badge.accessLevel}</p>
              <p><strong>Statut :</strong> {badge.statusText}</p>
            </div>
            <p className="mt-2 text-destructive font-medium">Cette action est irréversible.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirmDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBadgeDialog;
