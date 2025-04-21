
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AbsenceForm from './AbsenceForm';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CreateAbsenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateAbsenceDialog: React.FC<CreateAbsenceDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = async (data: any) => {
    try {
      // Préparation des données pour Firestore
      const absenceData = {
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        type: data.type,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        status: 'pending', // Statut par défaut pour une nouvelle demande
        reason: data.reason,
        notes: data.notes,
        createdAt: new Date(),
        // Calculer le nombre de jours
        days: Math.ceil(
          (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1 // +1 car inclusif
      };

      // Use HR.ABSENCE_REQUESTS which we added to the COLLECTIONS object
      const collectionPath = COLLECTIONS.HR.ABSENCE_REQUESTS || 'hr_absences';
      
      // Enregistrer dans Firestore
      await addDocument(collectionPath, absenceData);
      
      toast.success("Demande d'absence créée avec succès");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création de la demande d'absence:", error);
      toast.error("Erreur lors de la création de la demande d'absence");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande d'absence</DialogTitle>
        </DialogHeader>
        <AbsenceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAbsenceDialog;
