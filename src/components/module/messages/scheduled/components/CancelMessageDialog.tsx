
import React from 'react';
import { Message } from '../../types/message-types';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { formatScheduledDate } from '../utils/messageUtils';

interface CancelMessageDialogProps {
  open: boolean;
  message: Message | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const CancelMessageDialog: React.FC<CancelMessageDialogProps> = ({
  open,
  message,
  onOpenChange,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Annuler l'envoi du message ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir annuler l'envoi de ce message programmé ? Cette action est irréversible.
            {message && message.scheduledAt && (
              <div className="mt-2 p-3 bg-gray-50 rounded border">
                <div className="font-medium">{message.subject}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Programmé pour: {formatScheduledDate(message.scheduledAt)}
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmer l'annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelMessageDialog;
