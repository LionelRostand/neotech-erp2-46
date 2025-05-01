
import React, { useState } from 'react';
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
import { BadgeData } from './BadgeTypes';
import { toast } from 'sonner';
import { deleteBadge } from '../employees/services/badgeService';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DeleteBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
  onBadgeDeleted: (badgeId: string) => void;
}

const DeleteBadgeDialog: React.FC<DeleteBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
  onBadgeDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!badge) return null;

  const handleDelete = async () => {
    if (!badge) return;
    
    try {
      setIsDeleting(true);
      await deleteBadge(badge.id);
      toast.success('Badge supprimé avec succès');
      onBadgeDeleted(badge.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du badge:', error);
      toast.error('Échec de la suppression du badge');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce badge?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera définitivement le badge {badge.id} pour {badge.employeeName}.
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          {isDeleting ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suppression...
            </Button>
          ) : (
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBadgeDialog;
