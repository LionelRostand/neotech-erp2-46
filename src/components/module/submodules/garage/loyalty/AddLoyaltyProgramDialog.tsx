
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoyaltyProgram } from '../types/loyalty-types';
import { toast } from 'sonner';
import { useGarageLoyalty } from '@/hooks/garage/useGarageLoyalty';
import LoyaltyProgramForm from './LoyaltyProgramForm';

interface AddLoyaltyProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddLoyaltyProgramDialog = ({ open, onOpenChange, onSuccess }: AddLoyaltyProgramDialogProps) => {
  const { addLoyaltyProgram } = useGarageLoyalty();

  const handleSubmit = async (data: Partial<LoyaltyProgram>) => {
    try {
      await addLoyaltyProgram(data as Omit<LoyaltyProgram, 'id'>);
      toast.success("Programme de fidélité créé avec succès");
      onSuccess();
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      toast.error("Erreur lors de la création du programme");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Programme de Fidélité</DialogTitle>
        </DialogHeader>
        <LoyaltyProgramForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddLoyaltyProgramDialog;
