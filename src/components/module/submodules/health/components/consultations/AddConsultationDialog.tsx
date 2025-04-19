
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConsultationForm from '../ConsultationForm';
import type { Consultation } from '../../types/health-types';

interface AddConsultationDialogProps {
  open: boolean;
  onClose: () => void;
  onConsultationAdded: (consultation: Consultation) => void;
}

const AddConsultationDialog: React.FC<AddConsultationDialogProps> = ({
  open,
  onClose,
  onConsultationAdded
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Consultation</DialogTitle>
        </DialogHeader>
        <ConsultationForm 
          onSubmit={onConsultationAdded}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddConsultationDialog;
