
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Message } from '../../types/message-types';

interface CancelMessageDialogProps {
  open: boolean;
  message: Message;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelMessageDialog: React.FC<CancelMessageDialogProps> = ({
  open,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler le message programmé</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler l'envoi de ce message ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium">Sujet</h4>
            <p className="text-sm text-gray-500">{message.subject}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Programmé pour</h4>
            <p className="text-sm text-gray-500">
              {message.scheduledAt?.toDate ? 
                message.scheduledAt.toDate().toLocaleString() : 
                new Date(message.scheduledAt || '').toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmer l'annulation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelMessageDialog;
