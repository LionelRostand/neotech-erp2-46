
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConsultationForm from './ConsultationForm';
import { Consultation, Patient, Doctor } from '../../types/health-types';

interface AddConsultationDialogProps {
  open: boolean;
  onClose: () => void;
  onConsultationAdded: (consultation: Consultation) => void;
  patients: Patient[];
  doctors: Doctor[];
}

const AddConsultationDialog: React.FC<AddConsultationDialogProps> = ({ 
  open, 
  onClose, 
  onConsultationAdded,
  patients,
  doctors
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
          patients={patients}
          doctors={doctors}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddConsultationDialog;
